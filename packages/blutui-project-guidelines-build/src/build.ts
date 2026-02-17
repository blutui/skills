#!/usr/bin/env node

import { readdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'

import { SKILLS, DEFAULT_SKILL, SkillConfig } from './config'
import { parseRuleFile, RuleFile } from './parser'
import { Section } from './types'

const args = process.argv.slice(2)
const upgradeVersion = args.includes('--upgrade-version')
const skillArg = args.find((arg) => arg.startsWith('--skill='))
const skillName = skillArg ? skillArg.split('=')[1] : null
const buildAll = args.includes('--all')

function generateMarkdown(
  sections: Section[],
  metadata: {
    version: string
    organization: string
    date: string
  },
  skillConfig: SkillConfig
): string {
  let md = `# ${skillConfig.title}\n\n`
  md += `**Version ${metadata.version}**  \n`
  md += `${metadata.organization}  \n`
  md += `${metadata.date}\n\n`
  md += `---\n\n`
  md += `---\n\n`
  md += `## Table of Contents\n\n`

  sections.forEach((section) => {
    md += `${section.number}. [${section.title}](#${section.number}-${section.title.toLowerCase().replace(/\s+/g, '-')}) - **${section.impact}**\n`

    section.rules.forEach((rule) => {
      const anchor = `${rule.id} ${rule.title}`
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '')

      md += `   - ${rule.id} [${rule.title}](#${anchor})\n`
    })
  })

  md += `\n---\n\n`

  sections.forEach((section) => {
    md += `## ${section.number}. ${section.title}\n\n`
    md += `**Impact: ${section.impact}**\n\n`

    section.rules.forEach((rule) => {
      md += `### ${rule.id} ${rule.title}\n\n`
      md += `**Impact: ${rule.impact}**\n\n`
      md += `${rule.explanation}\n\n`

      rule.examples.forEach((example) => {
        // Only generate code block if there's actual code
        if (example.code && example.code.trim()) {
          md += `\`\`\`${example.language || 'canvas'}\n`
        }

        if (example.additionalText) {
          md += `${example.additionalText}\n\n`
        }
      })
    })

    md += `---\n\n`
  })

  return md
}

async function buildSkill(skillConfig: SkillConfig) {
  console.log(`\nBuilding ${skillConfig.name}...`)
  console.log(`  Rules directory: ${skillConfig.rulesDir}`)
  console.log(`  Output file: ${skillConfig.outputFile}`)

  const files = await readdir(skillConfig.rulesDir)
  const ruleFiles = files
    .filter((f) => f.endsWith('.md') && !f.startsWith('_') && f !== 'README.md')
    .sort()

  const ruleData: RuleFile[] = []
  for (const file of ruleFiles) {
    const filePath = join(skillConfig.rulesDir, file)
    try {
      const parsed = await parseRuleFile(filePath, skillConfig.sectionMap)
      ruleData.push(parsed)
    } catch (error) {
      console.error(`  Error parsing ${file}:`, error)
    }
  }

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
      rule.subsection = index + 1
    })
  })

  const sections = Array.from(sectionsMap.values()).sort(
    (a, b) => a.number - b.number
  )

  const sectionsFile = join(skillConfig.rulesDir, '_sections.md')
  try {
    const sectionsContent = await readFile(sectionsFile, 'utf-8')

    const sectionBlocks = sectionsContent
      .split(/(?=^## \d+\. )/m)
      .filter(Boolean)

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
  } catch (error) {
    console.warn('  Warning: Could not read _sections.md, using defaults')
  }

  let metadata
  metadata = {
    version: '1.0.0',
    organization: 'Blutui',
    date: new Date().toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    }),
  }

  const markdown = generateMarkdown(sections, metadata, skillConfig)

  await writeFile(skillConfig.outputFile, markdown, 'utf-8')

  console.log(
    `  Built AGENTS.md with ${sections.length} sections and ${ruleData.length} rules`
  )
}

async function build() {
  try {
    console.log('Building AGENTS.md from rules...')

    if (buildAll) {
    } else if (skillName) {
    } else {
      await buildSkill(SKILLS[DEFAULT_SKILL])
    }

    console.log('\nBuild complete ✓')
  } catch (error) {
    console.error('Build failed:', error)
    process.exit(1)
  }
}

build()
