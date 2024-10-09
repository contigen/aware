import { z } from 'zod'

export type ThreatLevel = 'Low' | 'Medium' | 'High'
export type ThreatType =
  | 'Phishing'
  | 'Malware'
  | 'Financial Scam'
  | 'Identity Theft'
  | 'Fake Offer'
export type SuspiciousElementType =
  | 'URL'
  | 'Email Address'
  | 'Phone Number'
  | 'Text Content'

export type PotentialThreat = {
  type: ThreatType
  description: string
  severity: ThreatLevel
}

export type SuspiciousElement = {
  type: SuspiciousElementType
  value: string
  reason: string
}

export type ScamAnalysisResult = {
  isScam: boolean
  overallThreatLevel: ThreatLevel
  confidence: number
  potentialThreats: PotentialThreat[]
  suspiciousElements: SuspiciousElement[]
  safetyTips: string[]
  recommendedActions: string[]
  summary: string
}

export const scamSchema = z.object({
  isScam: z.boolean(),
  overallThreatLevel: z.enum(['Low', 'Medium', 'High']),
  confidence: z.number(),
  potentialThreats: z.array(
    z.object({
      type: z.enum([
        'Phishing',
        'Malware',
        'Financial Scam',
        'Identity Theft',
        'Fake Offer',
      ]),
      description: z.string(),
      severity: z.enum(['Low', 'Medium', 'High']),
    })
  ),
  suspiciousElements: z.array(
    z.object({
      type: z.enum(['URL', 'Email Address', 'Phone Number', 'Text Content']),
      value: z.string(),
      reason: z.string(),
    })
  ),
  safetyTips: z.array(z.string()),
  recommendedActions: z.array(z.string()),
  summary: z.string(),
})

export type stateField<T> = {
  [K in keyof T]: {
    [P in K]: T[P]
  }
}[keyof T]
