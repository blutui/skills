export type ImpactLevel =
  | 'CRITICAL'
  | 'HIGH'
  | 'MEDIUM-HIGH'
  | 'MEDIUM'
  | 'LOW-MEDIUM'
  | 'LOW'

export interface Rule {
  id: string
  title: string
  name: string
  section: number
  impact: ImpactLevel
  content: string
}

export interface RuleFile {
  section: number
  rule: Rule
}

export interface RuleFrontmatter {
  title: string
  category: string
  impact: ImpactLevel
}

export interface Skill {
  meta: SkillMeta
  skill: string
  skillDir: string
  sections: Section[]
  rules: number
}

export interface SkillMeta {
  title: string
  description: string
  sections: Record<string, number>
  whenToApply: string[]
  license?: string
  metadata?: {
    author?: string
    version?: string
  }
}

export interface SkillCategory {}

export interface Section {
  number: number
  title: string
  impact: ImpactLevel
  rules: Rule[]
}
