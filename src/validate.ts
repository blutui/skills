#!/usr/bin/env node

import { readdir, readFile } from 'fs/promises'
import { join } from 'path'

import { SKILLS_DIR } from './config'
import { ImpactLevel, RuleFrontmatter, Section, SkillMeta } from './types'

interface ValidationError {
  skill: string
  file?: string
  message: string
}

interface SkillValidationResult {
  skillName: string
  errors: ValidationError[]
  warnings: ValidationError[]
}

interface ValidatedRule {
  filename: string
  frontmatter: RuleFrontmatter
}

interface ParseResult {
  parsed: Record<string, unknown>
  body: string
  hasFrontmatter: boolean
}

function extractFrontmatter(content: string): ParseResult {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match) {
    return { parsed: {}, body: content.trim(), hasFrontmatter: false }
  }

  const raw = match[1]
  const body = content.slice(match[0].length).trim()
  const parsed: Record<string, unknown> = {}

  for (const line of raw.split(/\r?\n/)) {
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) continue
    const key = line.slice(0, colonIdx).trim()
    const rawVal = line.slice(colonIdx + 1).trim()

    parsed[key] = rawVal.replace(/^["']|["']$/g, '')
  }

  return { parsed, body, hasFrontmatter: true }
}

function validateSkillJson(
  raw: unknown,
  skill: string
): { meta: SkillMeta | null; errors: ValidationError[] } {
  const errors: ValidationError[] = []
  const file = 'skill.json'

  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    errors.push({
      skill,
      file,
      message: 'skill.json must be a JSON object',
    })
    return { meta: null, errors }
  }

  const obj = raw as Record<string, unknown>

  // Required top-level string fields...
  for (const key of ['name', 'title', 'description', 'license'] as const) {
    if (
      !obj[key] ||
      typeof obj[key] !== 'string' ||
      (obj[key] as string).trim() === ''
    ) {
      errors.push({
        skill,
        file,
        message: `Missing or empty required field: "${key}"`,
      })
    }
  }

  // Sections...
  if (
    !obj.sections ||
    typeof obj.sections !== 'object' ||
    Array.isArray(obj.sections)
  ) {
    errors.push({
      skill,
      file,
      message: 'Missing or invalid "sections" object',
    })
  } else {
    const sections = obj.sections as Record<string, number>

    for (const [key, value] of Object.entries(sections)) {
      if (typeof key !== 'string' || key.trim() === '') {
        errors.push({
          skill,
          file,
          message: 'sections keys must be non-empty strings',
        })
      }
      if (typeof value !== 'number' || !Number.isInteger(value)) {
        errors.push({
          skill,
          file,
          message: `sections.${key} must be an integer, got ${typeof value}`,
        })
      }
    }

    const sectionNumbers = Object.values(sections)
    const uniqueNumbers = new Set(sectionNumbers)
    if (uniqueNumbers.size !== sectionNumbers.length) {
      errors.push({
        skill,
        file,
        message: 'sections values must be unique',
      })
    }

    const sortedNumbers = [...sectionNumbers].sort((a, b) => a - b)
    for (let i = 0; i < sortedNumbers.length; i++) {
      if (sortedNumbers[i] !== i + 1) {
        errors.push({
          skill,
          file,
          message: 'sections values must be sequential starting from 1',
        })
        break
      }
    }
  }

  // whenToApply array...
  if (!Array.isArray(obj.whenToApply) || obj.whenToApply.length === 0) {
    errors.push({
      skill,
      file,
      message: '"whenToApply" must be a non-empty array',
    })
  }

  // metadata object...
  if (
    !obj.metadata ||
    typeof obj.metadata !== 'object' ||
    Array.isArray(obj.metadata)
  ) {
    errors.push({
      skill,
      file,
      message: 'Missing or invalid "metadata" object',
    })
  } else {
    const meta = obj.metadata as Record<string, unknown>
    for (const key of ['author', 'version'] as const) {
      if (!meta[key]) {
        errors.push({
          skill,
          file,
          message: `Missing or empty "metadata.${key}"`,
        })
      }
    }
  }

  if (errors.length > 0) return { meta: null, errors }

  return { meta: obj as unknown as SkillMeta, errors: [] }
}

interface RuleValidationResult {
  frontmatter: RuleFrontmatter | null
  body: string
  errors: ValidationError[]
  warnings: ValidationError[]
}

function validateRule(
  content: string,
  filename: string,
  skillName: string,
  sections: Record<string, number>
): RuleValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationError[] = []
  const { parsed, body, hasFrontmatter } = extractFrontmatter(content)

  if (!hasFrontmatter) {
    errors.push({
      skill: skillName,
      file: `rules/${filename}`,
      message: 'Missing frontmatter block (file must start with ---)',
    })
    return { frontmatter: null, body, errors, warnings }
  }

  const required = ['title', 'impact', 'impactDescription', 'tags'] as const
  for (const key of required) {
    const val = parsed[key]
    const missing = val === undefined || val === null || val === ''
    if (missing) {
      errors.push({
        skill: skillName,
        file: `rules/${filename}`,
        message: `Frontmatter missing required key: "${key}"`,
      })
    }
  }

  if (errors.length > 0) return { frontmatter: null, body, errors, warnings }

  return {
    frontmatter: {
      title: parsed.title as string,
      impact: parsed.impact as ImpactLevel,
    },
    body,
    errors: [],
    warnings,
  }
}

async function validateSkill(
  skillName: string
): Promise<SkillValidationResult> {
  // skill.json
  const skillDir = join(SKILLS_DIR, skillName)
  const errors: ValidationError[] = []
  const warnings: ValidationError[] = []

  let meta: SkillMeta | null = null
  try {
    const raw = JSON.parse(
      await readFile(join(skillDir, 'skill.json'), 'utf-8')
    )
    const result = validateSkillJson(raw, skillName)
    errors.push(...result.errors)
    meta = result.meta
  } catch {
    errors.push({
      skill: skillName,
      file: 'skill.json',
      message: 'Could not read or parse skill.json',
    })
  }

  // rules/ directory
  const rulesDir = join(skillDir, 'rules')
  let ruleFilenames: string[] = []

  try {
    ruleFilenames = (await readdir(rulesDir)).filter((f) => f.endsWith('.md'))
  } catch {
    errors.push({
      skill: skillName,
      file: 'rules/',
      message: 'Missing rules/ directory',
    })
  }

  if (ruleFilenames.length === 0 && !errors.some((e) => e.file === 'rules/')) {
    errors.push({
      skill: skillName,
      message: 'Skill has no rule files in rules/ directory',
    })
  }

  // Individual rule validation (all in parallel)
  const validatedRules: ValidatedRule[] = []

  const ruleResults = await Promise.all(
    ruleFilenames.map(async (filename) => {
      const filePath = join(rulesDir, filename)
      const content = await readFile(filePath, 'utf-8')
      return validateRule(content, filename, skillName, meta?.sections ?? {})
    })
  )

  return { skillName, errors, warnings }
}

interface TaggedError extends ValidationError {
  tag: string
  severity: 'error' | 'warning'
}

const CHECK_GROUPS: Array<{ label: string; tag: string }> = [
  { label: 'skill.json schema', tag: 'skill.json' },
  { label: 'Rule frontmatter', tag: 'frontmatter' },
  { label: 'Naming conventions', tag: 'convention' },
  { label: 'Cross-rule uniqueness', tag: 'uniqueness' },
  { label: 'Build output integrity', tag: 'build' },
]

function renderSkillSummary(
  result: SkillValidationResult & { tagged: TaggedError[] }
): { errorCount: number; warningCount: number } {
  const WIDTH = 62
  const bar = '─'.repeat(WIDTH)

  const hasErrors = result.tagged.some((e) => e.severity === 'error')
  const hasWarnings = result.tagged.some((e) => e.severity === 'warning')

  const statusLabel = hasErrors ? 'FAIL' : hasWarnings ? 'WARN' : 'PASS'
  const heading = `${statusLabel} ${result.skillName}`

  console.log(`┌${bar}┐`)
  console.log(`│ ${heading.padEnd(WIDTH - 2)} │`)
  console.log(`├${bar}┤`)

  let errorCount = 0
  let warningCount = 0

  for (const group of CHECK_GROUPS) {
    const groupErrors = result.tagged.filter(
      (e) => e.tag === group.tag && e.severity === 'error'
    )
    const groupWarnings = result.tagged.filter(
      (e) => e.tag === group.tag && e.severity === 'warning'
    )
    const groupFailed = groupErrors.length > 0
    const groupWarn = groupWarnings.length > 0

    const checkIcon = groupFailed ? '✘' : groupWarn ? '△' : '✔'
    const checkLine = `${checkIcon} ${group.label}`
    console.log(`│ ${checkLine.padEnd(WIDTH - 2)} │`)

    for (const e of [...groupErrors, ...groupWarnings]) {
      const loc = e.file ? `${e.file} — ` : ''
      const bullet = `  · ${loc}${e.message}`
      const chunks = chunkString(bullet, WIDTH - 1)

      for (const chunk of chunks) {
        console.log(`│ ${chunk.padEnd(WIDTH - 2)} │`)
      }

      if (e.severity === 'error') errorCount++
      else warningCount++
    }
  }

  console.log(`└${bar}┘`)
  return { errorCount, warningCount }
}

function chunkString(str: string, maxLen: number): string[] {
  if (str.length <= maxLen) return [str]

  const indent = ' '.repeat(4)
  const chunks: string[] = []
  let remaining = str
  while (remaining.length > maxLen) {
    let cut = remaining.lastIndexOf(' ', maxLen)
    if (cut <= 0) cut = maxLen
    chunks.push(remaining.slice(0, cut))
    remaining = indent + remaining.slice(cut).trimStart()
  }

  chunks.push(remaining)

  return chunks
}

function tagErrors(result: SkillValidationResult): TaggedError[] {
  const tag = (
    e: ValidationError,
    severity: 'error' | 'warning'
  ): TaggedError => {
    let t = 'frontmatter' // default

    if (e.file === 'skill.json' || e.message.includes('skill.json')) {
      t = 'skill.json'
    } else if (e.file === 'rules/') {
      t = 'skill.json' // missing rules/ dir is a structural problem
    }

    return { ...e, tag: t, severity }
  }

  return [
    ...result.errors.map((e) => tag(e, 'error')),
    ...result.warnings.map((e) => tag(e, 'warning')),
  ]
}

function renderResults(results: SkillValidationResult[]): {
  totalErrors: number
  totalWarnings: number
} {
  let totalErrors = 0
  let totalWarnings = 0

  for (const result of results) {
    const tagged = tagErrors(result)
    const { errorCount, warningCount } = renderSkillSummary({
      ...result,
      tagged,
    })
    totalErrors += errorCount
    totalWarnings += warningCount
  }

  return {
    totalErrors,
    totalWarnings,
  }
}

async function validate(): Promise<void> {
  console.log('🔍 Validating agent skills...\n')

  let dirNames: string[] = []
  try {
    const entries = await readdir(SKILLS_DIR, { withFileTypes: true })
    dirNames = entries
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort()
  } catch {
    console.error(`❌ Could not read skills directory: ${SKILLS_DIR}`)
    process.exit(1)
  }

  if (dirNames.length === 0) {
    console.warn('⚠️ No skill directories found.')
    process.exit(0)
  }

  const results = await Promise.all(dirNames.map((d) => validateSkill(d)))

  const { totalErrors, totalWarnings } = renderResults(results)

  const skillCount = results.length
  const passCount = results.filter((r) => r.errors.length === 0).length
  const failCount = skillCount - passCount

  console.log('')
  console.log(
    `Skills: ${passCount} passed, ${failCount} failed, ${skillCount} total`
  )
  console.log(`Issues: ${totalErrors} error(s), ${totalWarnings} warning(s)`)

  if (totalErrors > 0) {
    console.error('\n❌ Validation failed — fix the errors above.')
    process.exit(1)
  }

  if (totalWarnings > 0) {
    console.warn('\n⚠️ Validation passed with warnings.')
  } else {
    console.log('\n✅ All skills valid.')
  }
}

validate().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`\n❌ Validator crashed: ${message}`)
  process.exit(1)
})
