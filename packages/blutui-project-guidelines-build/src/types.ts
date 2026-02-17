export type ImpactLevel =
  | 'CRITICAL'
  | 'HIGH'
  | 'MEDIUM-HIGH'
  | 'MEDIUM'
  | 'LOW-MEDIUM'
  | 'LOW'

export interface Example {
  label: string
  description?: string
  code: string
  language?: string
  additionalText?: string
}

export interface Rule {
  id: string
  title: string
  section: number
  subsection?: number
  impact: ImpactLevel
  impactDescription?: string
  explanation: string
  examples: Example[]
  tags?: string[]
}

export interface Section {
  number: number
  title: string
  impact: ImpactLevel
  rules: Rule[]
}
