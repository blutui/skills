import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const SKILLS_DIR = join(__dirname, '../../..', 'skills')
export const BUILD_DIR = join(__dirname, '..')

export interface SkillConfig {
  name: string
  title: string
  description: string
  skillDir: string
  rulesDir: string
  outputFile: string
  sectionMap: Record<string, number>
}

export const SKILLS: Record<string, SkillConfig> = {
  'blutui-project-guidelines': {
    name: 'blutui-project-guidelines',
    title: 'Blutui Project Guidelines',
    description: 'Blutui project codebase guidelines',
    skillDir: join(SKILLS_DIR, 'blutui-project-guidelines'),
    rulesDir: join(SKILLS_DIR, 'blutui-project-guidelines/rules'),
    outputFile: join(SKILLS_DIR, 'blutui-project-guidelines/AGENTS.md'),
    sectionMap: {
      foundation: 1,
    },
  },
}

export const DEFAULT_SKILL = 'blutui-project-guidelines'
