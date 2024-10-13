import { ScamAnalysisResult } from '&/types'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateReadableSummary(result: ScamAnalysisResult) {
  let summary = `Based on our analysis, this ${
    result.isScam ? `appears to be a scam` : `does not appear to be a scam`
  }. `
  summary += `The overall threat level is ${
    result.overallThreatLevel
  }, with a confidence of ${result.confidence * 100}%. `

  if (result.potentialThreats.length > 0) {
    summary += `We've identified the following potential threats: `
    result.potentialThreats.forEach((threat, index) => {
      summary += `${index > 0 ? `, ` : ``}${threat.type} (${
        threat.severity
      } severity)`
    })
    summary += `.`
  }

  if (result.suspiciousElements.length > 0) {
    summary += `We've found some suspicious elements: `
    result.suspiciousElements.forEach((element, index) => {
      summary += `${index > 0 ? ', ' : ''}a ${element.type.toLowerCase()} (${
        element.value
      }) because ${element.reason}`
    })
    summary += `.`
  }

  if (result.safetyTips.length > 0) {
    summary += `Here are some safety tips: `
    summary += result.safetyTips.join(`. `) + `.`
  }

  if (result.recommendedActions.length > 0) {
    summary += `We recommend the following actions: `
    summary += result.recommendedActions.join(`. `) + `.`
  }

  summary += `To summarise: ${result.summary}`

  return summary
}
