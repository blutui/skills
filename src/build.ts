#!/usr/bin/env node

import { access, readdir, readFile, writeFile } from 'fs/promises'
import { basename, join } from 'path'

import { SKILLS_DIR } from './config'
import type {
  ImpactLevel,
  Rule,
  RuleFile,
  RuleFrontmatter,
  Section,
  Skill,
} from './types'

function parseFrontmatter(
  rawContent: string,
  filePath: string
): {
  frontmatter: RuleFrontmatter
  content: string
} {
  const content = rawContent.replace(/\r\n/g, '\n')
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match) {
    throw new Error(`Missing frontmatter in ${filePath}.`)
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

  return {
    frontmatter: {
      title: parsed.title as string,
      category: '',
      impact: parsed.impact as ImpactLevel,
    },
    content: body,
  }
}

async function parseRuleFile(
  filePath: string,
  sectionMap?: Record<string, number>
) {
  const rawContent = await readFile(filePath, 'utf-8')
  const { frontmatter, content } = parseFrontmatter(rawContent, filePath)

  let impact: Rule['impact'] = 'MEDIUM'

  const filename = basename(filePath)
  const name = filename.replace('.md', '')

  const filenameParts = name.split('-')
  let section = 0

  for (let len = filenameParts.length; len > 0; len--) {
    const prefix = filenameParts.slice(0, len).join('-')
    if (sectionMap && sectionMap[prefix] !== undefined) {
      section = sectionMap[prefix]
      break
    }
  }

  const rule: Rule = {
    id: '',
    title: frontmatter.title,
    name,
    section,
    impact: frontmatter.impact || impact,
    content,
  }

  return {
    section,
    rule,
  }
}

/**
 * Load a single skill directory. Returns null if the skill should be skipped.
 */
async function loadSkill(skill: string): Promise<Skill | null> {
  const skillDir = join(SKILLS_DIR, skill)
  const metaPath = join(skillDir, 'skill.json')
  const rulesDir = join(skillDir, 'rules')

  // Check required paths exist
  const [metaExists, rulesExist] = await Promise.all([
    access(metaPath)
      .then(() => true)
      .catch(() => false),
    access(rulesDir)
      .then(() => true)
      .catch(() => false),
  ])

  if (!metaExists) {
    console.warn(`⚠️ Skipping '${skill}' — missing skill.json`)
    return null
  }
  if (!rulesExist) {
    console.warn(`⚠️ Skipping '${skill}' — missing rules/ directory`)
  }

  const meta = JSON.parse(await readFile(metaPath, 'utf-8'))

  const files = await readdir(rulesDir)
  const ruleFiles = files.filter(
    (f) => f.endsWith('.md') && !f.startsWith('_') && f !== 'README.md'
  )

  const ruleData: RuleFile[] = []
  for (const file of ruleFiles) {
    const filePath = join(rulesDir, file)
    try {
      const parsed = await parseRuleFile(filePath, meta.sections)
      ruleData.push(parsed)
    } catch (error) {
      throw error
    }
  }

  // Group rules by section
  const sectionsMap = new Map<number, Section>()

  ruleData.forEach(({ section, rule }) => {
    if (!sectionsMap.has(section)) {
      sectionsMap.set(section, {
        number: section,
        title: `Section ${section}`,
        impact: rule.impact,
        rules: [],
      })
    }
    sectionsMap.get(section)!.rules.push(rule)
  })

  sectionsMap.forEach((section) => {
    section.rules.sort((a, b) =>
      a.title.localeCompare(b.title, 'en-US', { sensitivity: 'base' })
    )

    section.rules.forEach((rule, index) => {
      rule.id = `${section.number}.${index + 1}`
    })
  })

  // Convert to array and sort
  const sections = Array.from(sectionsMap.values()).sort(
    (a, b) => a.number - b.number
  )

  // Read section metadata from consolidated _sections.md file
  const sectionsPath = join(rulesDir, '_sections.md')
  const sectionsContent = await readFile(sectionsPath, 'utf-8')

  const sectionBlocks = sectionsContent.split(/(?=^## \d+\. )/m).filter(Boolean)

  for (const block of sectionBlocks) {
    const headerMatch = block.match(/^## (\d+)\.\s+(.+?)(?:\s+\([^)]+\))?$/m)
    if (!headerMatch) continue

    const sectionNumber = parseInt(headerMatch[1])
    const sectionTitle = headerMatch[2].trim()

    const section = sections.find((s) => s.number === sectionNumber)
    if (section) {
      section.title = sectionTitle
    }
  }

  return { meta, skill, skillDir, sections, rules: ruleData.length }
}

async function loadSkills() {
  const entries = await readdir(SKILLS_DIR, { withFileTypes: true })
  const dirNames = entries.filter((e) => e.isDirectory()).map((e) => e.name)

  const results = await Promise.all(
    dirNames.map((dirName) => loadSkill(dirName))
  )

  return results.filter((s): s is Skill => s !== null)
}

function buildSkillMd(skill: Skill): string {
  const lines: string[] = []
  const { meta, sections } = skill
  const totalRules = skill.rules

  lines.push('---')

  lines.push(`name: ${skill.skill}`)
  lines.push(`description: ${meta.description}`)
  lines.push(`license: ${meta.license}`)

  if (meta.metadata) {
    lines.push(`metadata:`)
    lines.push(`  author: ${meta.metadata.author}`)
    lines.push(`  version: "${meta.metadata.version}"`)
  }

  lines.push('---')
  lines.push('')

  lines.push(`# ${meta.title}`)
  lines.push('')
  lines.push(
    `Contains ${totalRules} rule${totalRules !== 1 ? 's' : ''} across ` +
      `${sections.length} categor${sections.length !== 1 ? 'ies' : 'y'}, ` +
      `prioritized by impact to guide automated refactoring and code generation.`
  )
  lines.push('')

  lines.push('## When to Apply')
  lines.push('')
  lines.push('Reference these guidelines when:')
  lines.push('')
  for (const item of meta.whenToApply) {
    lines.push(`- ${item}`)
  }
  lines.push('')

  lines.push('## Rule Categories by Priority')
  lines.push('')
  lines.push('| Priority | Category | Impact | Prefix |')
  lines.push('|----------|----------|--------|--------|')
  sections.forEach((section) => {
    const prefix = Object.keys(meta.sections).find(
      (key) => meta.sections[key] === section.number
    )

    lines.push(
      `| ${section.number} | ${section.title} | ${section.impact} | \`${prefix}-\` |`
    )
  })
  lines.push('')

  lines.push('## Quick Reference')
  lines.push('')
  sections.forEach((section) => {
    lines.push(`### ${section.number}. ${section.title} (${section.impact})`)
    lines.push('')

    section.rules.forEach((rule) => {
      lines.push(`- \`${rule.name}\` - ${rule.title}`)
    })

    lines.push('')
  })

  lines.push('## How to Use')
  lines.push('')
  lines.push(
    'Read individual rule files for detailed explanations and code examples:'
  )
  lines.push('')
  lines.push('```')
  sections.forEach((section) => {
    const firstRule = section.rules[0]

    lines.push(`rules/${firstRule.name}.md`)
  })
  lines.push('```')
  lines.push('')
  lines.push('Each rule file contains:')
  lines.push('')
  lines.push('- Brief explanation of why it matters')
  lines.push('')

  lines.push('## Full Compiled Document')
  lines.push('')
  lines.push('For the complete guide with all rules expanded: `AGENTS.md`')
  lines.push('')

  return lines.join('\n')
}

function buildAgentsMd(skill: Skill): string {
  const lines: string[] = []
  const { sections } = skill

  lines.push(`# ${skill.meta.title}`)
  lines.push('')

  lines.push('---')
  lines.push('')
  lines.push('## Table of Contents')
  lines.push('')

  // Generate TOC
  sections.forEach((section) => {
    lines.push(
      `${section.number}. [${section.title}](#${section.number}-${section.title.toLowerCase().replace(/\s+/g, '-')})`
    )

    section.rules.forEach((rule) => {
      const anchor = `${rule.id} ${rule.title}`
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '')

      lines.push(`   - ${rule.id} [${rule.title}](#${anchor})`)
    })
  })

  lines.push('')
  lines.push('---')
  lines.push('')

  // Generate sections
  sections.forEach((section) => {
    lines.push(`## ${section.number}. ${section.title}`)
    lines.push('')

    section.rules.forEach((rule) => {
      lines.push(`### ${rule.id} ${rule.title}`)
      lines.push('')
      lines.push(rule.content)
      lines.push('')
    })

    lines.push('---')
    lines.push('')
  })

  return lines.join('\n')
}

async function writeSkill(skill: Skill): Promise<void> {
  const skillMdOut = join(skill.skillDir, 'SKILL.md')
  const agentsOut = join(skill.skillDir, 'AGENTS.md')

  await Promise.all([
    writeFile(skillMdOut, buildSkillMd(skill), 'utf-8'),
    writeFile(agentsOut, buildAgentsMd(skill), 'utf-8'),
  ])

  console.log(`   → ${skillMdOut}`)
  console.log(`   → ${agentsOut}`)
}

async function build(): Promise<void> {
  console.log('🔨 Building agent skills from rules...')

  const skills = await loadSkills()

  if (skills.length === 0) {
    console.warn(
      '\n⚠️  No valid skills found. Each skill folder needs a skill.json and a rules/ directory.'
    )
  }

  const totalRules = skills.reduce((sum, sk) => sum + sk.rules, 0)
  console.log(`\n📊 ${skills.length} skill(s), ${totalRules} total rule(s)\n`)

  await Promise.all(
    skills.map(async (skill) => {
      console.log(`📝 Writing docs for "${skill.meta.title}"...`)
      await writeSkill(skill)
    })
  )

  console.log('\n✅ Done!')
}

build().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`\n❌ Build failed: ${message}`)
  process.exit(1)
})
