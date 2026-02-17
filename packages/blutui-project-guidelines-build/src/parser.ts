import { basename } from 'path'
import { Example, ImpactLevel, Rule } from './types'
import { readFile } from 'fs/promises'

export interface RuleFile {
  section: number
  subsection?: number
  rule: Rule
}

export async function parseRuleFile(
  filePath: string,
  sectionMap?: Record<string, number>
): Promise<RuleFile> {
  const rawContent = await readFile(filePath, 'utf-8')
  const content = rawContent.replace(/\r\n/g, '\n')
  const lines = content.split('\n')

  let frontmatter: Record<string, any> = {}
  let contentStart = 0

  if (content.startsWith('---')) {
    const frontmatterEnd = content.indexOf('---', 3)
    if (frontmatterEnd !== -1) {
      const frontmatterText = content.slice(3, frontmatterEnd).trim()
      frontmatterText.split('\n').forEach((line) => {
        const [key, ...valueParts] = line.split(':')
        if (key && valueParts.length) {
          const value = valueParts.join(':').trim()
          frontmatter[key.trim()] = value.replace(/^["']|["']$/g, '')
        }
      })
      contentStart = frontmatterEnd + 3
    }
  }

  const ruleContent = content.slice(contentStart).trim()
  const ruleLines = ruleContent.split('\n')

  let title = ''
  let titleLine = 0
  for (let i = 0; i < ruleLines.length; i++) {
    if (ruleLines[i].startsWith('##')) {
      title = ruleLines[i].replace(/^##+\s*/, '').trim()
      titleLine = i
      break
    }
  }

  let impact: Rule['impact'] = 'MEDIUM'
  let impactDescription = ''
  let explanation = ''
  let examples: Rule['examples'] = []
  let reference: string[] = []

  let currentExample: Example | null = null
  let inCodeBlock = false
  let codeBlockLanguage = 'canvas'
  let codeBlockContent: string[] = []
  let afterCodeBlock = false
  let additionalText: string[] = []
  let hasCodeBlockForCurrentExample = false

  for (let i = titleLine + 1; i < ruleLines.length; i++) {
    const line = ruleLines[i]

    if (line.includes('**Impact:')) {
      const match = line.match(
        /\*\*Impact:\s*(\w+(?:-\w+)?)\s*(?:\(([^)]+)\))?/i
      )
      if (match) {
        impact = match[1].toUpperCase().replace(/-/g, '-') as ImpactLevel
        impactDescription = match[2] || ''
      }
      continue
    }

    // Code block start
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        console.log(codeBlockContent)
        // End of code block
        if (currentExample) {
          currentExample.code = codeBlockContent.join('\n')
          currentExample.language = codeBlockLanguage
        }
        codeBlockContent = []
        inCodeBlock = false
        afterCodeBlock = true
      } else {
        // Start of code block
        inCodeBlock = true
        hasCodeBlockForCurrentExample = true
        codeBlockLanguage = line.slice(3).trim() || 'typescript'
        codeBlockContent = []
        afterCodeBlock = false
      }
      continue
    }

    if (inCodeBlock) {
      codeBlockContent.push(line)
      continue
    }

    // Example label (Incorrect, Correct, Example, Usage, Implementation, etc.)
    // Match pattern: **Label:** or **Label (description):** at end of line
    // This distinguishes example labels from inline bold text like "**Trade-off:** some text"
    const labelMatch = line.match(/^\*\*([^:]+?):\*?\*?$/)
    if (labelMatch) {
      const fullLabel = labelMatch[1].trim()
      // Try to extract description from parentheses if present (handles simple cases)
      // For nested parentheses, we keep the full label
      const descMatch = fullLabel.match(
        /^([A-Za-z]+(?:\s+[A-Za-z]+)*)\s*\(([^()]+)\)$/
      )
      currentExample = {
        label: descMatch ? descMatch[1].trim() : fullLabel,
        description: descMatch ? descMatch[2].trim() : undefined,
        code: '',
        language: codeBlockLanguage,
      }
      continue
    }

    // Regular text (explanation or additional context after examples)
    if (line.trim() && !line.startsWith('#')) {
      if (!currentExample && !inCodeBlock) {
        // Main explanation before any examples
        explanation += (explanation ? '\n\n' : '') + line
      } else if (
        currentExample &&
        (afterCodeBlock || !hasCodeBlockForCurrentExample)
      ) {
        // Text after a code block, or text in a section without a code block
        // (e.g., "When NOT to use this pattern:" with bullet points instead of code)
        additionalText.push(line)
      }
    }
  }

  // Handle last example if still open
  if (currentExample) {
    if (additionalText.length > 0) {
      currentExample.additionalText = additionalText.join('\n\n')
    }
    examples.push(currentExample)
  }

  const filename = basename(filePath)

  const filenameParts = filename.replace('.md', '').split('-')
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
    title: frontmatter.title || title,
    section,
    subsection: undefined,
    impact: frontmatter.impact || impact,
    impactDescription: frontmatter.impactDescription || impactDescription,
    explanation: frontmatter.explanation || explanation.trim(),
    examples,
    tags: frontmatter.tags
      ? frontmatter.tags.split(',').map((t: string) => t.trim())
      : undefined,
  }

  return {
    section,
    subsection: 0,
    rule,
  }
}
