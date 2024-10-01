'use server'

import { createStreamableValue } from 'ai/rsc'
import { CoreMessage, streamText } from 'ai'
import { google } from '@ai-sdk/google'

interface ScamAnalysisResult {
  overallThreatLevel: 'Low' | 'Medium' | 'High'
  confidenceScore: number // 0 to 1
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
}

const SYSTEM_INSTRUCTION = `You are an AI assistant specialized in detecting and analyzing potential scams, particularly those targeting senior citizens. Your primary function is to analyze text inputs (such as emails, messages, or website content) and provide a structured assessment of potential threats. Follow these guidelines:

1. Analyze the input thoroughly for signs of common scams, including but not limited to phishing, financial fraud, identity theft, and malware distribution.

2. Maintain a calm, reassuring tone in your analysis. Avoid using alarmist language that might cause undue panic.

3. Provide your analysis in a structured JSON format as defined below. Ensure all fields are filled with appropriate, relevant information.

4. Base your threat assessments on factual indicators present in the text. Avoid speculation or assumptions beyond what's directly evident.

5. When identifying suspicious elements (like URLs or phone numbers), explain clearly why they are considered suspicious.

6. Offer practical, easy-to-understand safety tips and recommended actions tailored to senior citizens.

7. If the input appears to be benign, still provide a full analysis explaining why it's considered safe.

8. Do not include any personally identifiable information in your output, even if present in the input.

9. If you're unsure about any aspect of the analysis, reflect this in the confidence score and mention it in the output.

10. Remember that your audience may not be tech-savvy. Use clear, simple language in all explanations.

Output your analysis in the following JSON structure:

{
  "overallThreatLevel": "Low" | "Medium" | "High",
  "confidenceScore": number, // 0 to 1
  "potentialThreats": [
    {
      "type": "Phishing" | "Malware" | "Financial Scam" | "Identity Theft" | "Fake Offer",
      "description": string,
      "severity": "Low" | "Medium" | "High"
    }
  ],
  "suspiciousElements": [
    {
      "type": "URL" | "Email Address" | "Phone Number" | "Text Content",
      "value": string,
      "reason": string
    }
  ],
  "safetyTips": [string],
  "recommendedActions": [string],
  "summary": string // A brief, easy-to-understand summary of the analysis
}

Ensure your analysis is thorough, accurate, and helpful for senior citizens trying to protect themselves from online scams and fraud.`

export async function sendPromptToAI(messages: CoreMessage[]) {
  const result = await streamText({
    model: google(`models/gemini-1.5-flash-latest`),
    system: SYSTEM_INSTRUCTION,
    messages,
  })
  const stream = createStreamableValue(result.textStream)
  return stream.value
}
