import { z } from 'zod';

export type ScamAnalysisResult = {
  isScam: boolean
  overallThreatLevel: 'Low' | 'Medium' | 'High'
  confidence: number
  potentialThreats: {
    type:
      | 'Phishing'
      | 'Malware'
      | 'Financial Scam'
      | 'Identity Theft'
      | 'Fake Offer'
    description: string
    severity: 'Low' | 'Medium' | 'High'
  }[]
  suspiciousElements: {
    type: 'URL' | 'Email Address' | 'Phone Number' | 'Text Content'
    value: string
    reason: string
  }[]
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
});

