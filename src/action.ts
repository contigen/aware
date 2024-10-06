'use server'

import { createStreamableValue } from 'ai/rsc'
import { CoreMessage, generateObject, streamText } from 'ai'
import { google } from '@ai-sdk/google'
import { ScamAnalysisResult, scamSchema } from './types'

const SYSTEM_INSTRUCTION_CHAT = `You are an AI assistant specialized in detecting and analyzing potential scams, particularly those targeting senior citizens. Your primary function is to analyze text inputs (such as emails, messages, or website content) Follow these guidelines:

1. Analyze the input thoroughly for signs of common scams, including but not limited to phishing, financial fraud, identity theft, and malware distribution.

2. Maintain a calm, reassuring tone in your analysis. Avoid using alarmist language that might cause undue panic.

4. Base your threat assessments on factual indicators present in the text. Avoid speculation or assumptions beyond what's directly evident.

5. When identifying suspicious elements (like URLs or phone numbers), explain clearly why they are considered suspicious.

6. Offer practical, easy-to-understand safety tips and recommended actions tailored to senior citizens.

7. If the input appears to be benign, still provide a full analysis explaining why it's considered safe.


8. If you're unsure about any aspect of the analysis, reflect this in the confidence score and mention it in the output.

9. Remember that your audience may not be tech-savvy. Use clear, simple language in all explanations.

Ensure your analysis is thorough, accurate, and helpful for senior citizens trying to protect themselves from online scams; provide adequate information to the user on-demand.`

const SYSTEM_INSTRUCTION_TEXT = `${SYSTEM_INSTRUCTION_CHAT}

Output your analysis in the following JSON structure:

{
  "isScam": boolean,
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
  note: media content is also supported, return the response in the same format as the text content.
`

export async function analyseText(messages: CoreMessage[]) {
  const { object } = await generateObject({
    model: google(`models/gemini-1.5-flash-8b`),
    system: SYSTEM_INSTRUCTION_TEXT,
    schema: scamSchema,
    messages,
  })
  return object
}

export async function analyseChat(
  messages: CoreMessage[],
  analysisResult: ScamAnalysisResult
) {
  const result = await streamText({
    model: google(`models/gemini-1.5-flash-8b`),
    system: `${SYSTEM_INSTRUCTION_CHAT} \n Here is a previous analysis result, use it as context to respond to the user's message: ${JSON.stringify(
      analysisResult
    )} \n if it's empty, proceed to generate your own analysis strictly based on the user's input and respond accordingly, as an assistant`,
    messages,
  })
  const stream = createStreamableValue(result.textStream)
  return stream.value
}
