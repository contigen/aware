import { useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import {
  AlertTriangle,
  ThumbsUp,
  AlertCircle,
  ShieldAlert,
  DollarSign,
  UserX,
  Gift,
  Link,
  Mail,
  Phone,
  FileText,
  Volume2,
} from 'lucide-react'
import { Button } from '&/components/ui/button'
import { Progress } from '&/components/ui/progress'
import { Badge } from '&/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '&/components/ui/card'
import { useSpeechSynthesis } from '&/features/use-speech-synthesis'
import { generateReadableSummary } from '&/lib/utils'
import { toast } from '&/hooks/use-toast'

type ThreatLevel = 'Low' | 'Medium' | 'High'
type ThreatType =
  | 'Phishing'
  | 'Malware'
  | 'Financial Scam'
  | 'Identity Theft'
  | 'Fake Offer'
type SuspiciousElementType =
  | 'URL'
  | 'Email Address'
  | 'Phone Number'
  | 'Text Content'

interface PotentialThreat {
  type: ThreatType
  description: string
  severity: ThreatLevel
}

interface SuspiciousElement {
  type: SuspiciousElementType
  value: string
  reason: string
}

interface ScamAnalysisResult {
  isScam: boolean
  overallThreatLevel: ThreatLevel
  confidence: number
  potentialThreats: PotentialThreat[]
  suspiciousElements: SuspiciousElement[]
  safetyTips: string[]
  recommendedActions: string[]
  summary: string
}

const threatIcons: Record<ThreatType, React.ReactNode> = {
  Phishing: <AlertCircle className='h-5 w-5' />,
  Malware: <ShieldAlert className='h-5 w-5' />,
  'Financial Scam': <DollarSign className='h-5 w-5' />,
  'Identity Theft': <UserX className='h-5 w-5' />,
  'Fake Offer': <Gift className='h-5 w-5' />,
}

const suspiciousElementIcons: Record<SuspiciousElementType, React.ReactNode> = {
  URL: <Link className='h-5 w-5' />,
  'Email Address': <Mail className='h-5 w-5' />,
  'Phone Number': <Phone className='h-5 w-5' />,
  'Text Content': <FileText className='h-5 w-5' />,
}

const threatLevelColors: Record<ThreatLevel, string> = {
  Low: 'bg-success text-success-foreground',
  Medium: 'bg-warning text-warning-foreground',
  High: 'bg-destructive text-destructive-foreground',
}

function ScamAnalysis({ result }: { result: ScamAnalysisResult }) {
  const contentRef = useRef<HTMLDivElement>(null)
  const printFn = useReactToPrint({
    contentRef,
  })

  const [isReading, setIsReading] = useState(false)
  const [hasCompletedReading, setHasCompletedReading] = useState(false)

  const readableSummary = generateReadableSummary(result)
  const { speak, speechSynth, resume, pause } = useSpeechSynthesis(
    readableSummary,
    () => setHasCompletedReading(true)
  )

  const readAnalysisAloud = () => {
    if (!speechSynth) {
      toast({
        title: `Text-to-Speech not supported`,
        description: `Your browser does not support text-to-speech functionality.`,
        variant: `destructive`,
      })
      return
    }
    setIsReading(prev => !prev)
    if (isReading) {
      pause()
    } else if (!isReading && hasCompletedReading) {
      speak()
    } else {
      resume()
    }
  }

  return (
    <Card className='w-full max-w-4xl mx-auto'>
      <div ref={contentRef}>
        <CardHeader>
          <CardTitle className='text-3xl font-bold flex items-center'>
            {result.isScam ? (
              <AlertTriangle className='text-destructive mr-2' size={32} />
            ) : (
              <ThumbsUp className='text-success mr-2' size={32} />
            )}
            {result.isScam ? 'Potential Scam Detected' : 'Likely Safe'}
          </CardTitle>
          <CardDescription>
            Overall Threat Level:
            <Badge
              variant='outline'
              className={`ml-2 ${threatLevelColors[result.overallThreatLevel]}`}
            >
              {result.overallThreatLevel}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div>
            <h3 className='text-lg font-semibold mb-2'>Confidence</h3>
            <Progress value={result.confidence} className='w-full' />
            <p className='text-sm text-muted-foreground mt-1'>
              {result.confidence}% confident in this assessment
            </p>
          </div>

          <div>
            <h3 className='text-lg font-semibold mb-2'>Potential Threats</h3>
            <ul className='space-y-2'>
              {result.potentialThreats.map((threat, index) => (
                <li key={index} className='flex gap-2'>
                  <span className='mt-1'>{threatIcons[threat.type]}</span>
                  <div>
                    <p className='font-medium'>{threat.type}</p>
                    <p className='text-sm text-muted-foreground'>
                      {threat.description}
                    </p>
                    <Badge
                      variant='outline'
                      className={`mt-1 ${threatLevelColors[threat.severity]}`}
                    >
                      {threat.severity}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className='text-lg font-semibold mb-2'>Suspicious Elements</h3>
            <ul className='space-y-2'>
              {result.suspiciousElements.map((element, index) => (
                <li key={index} className='flex items-start'>
                  <span className='mr-2 mt-1'>
                    {suspiciousElementIcons[element.type]}
                  </span>
                  <div>
                    <p className='font-medium'>{element.type}</p>
                    <p className='text-sm'>{element.value}</p>
                    <p className='text-sm text-muted-foreground'>
                      {element.reason}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className='text-lg font-semibold mb-2'>Safety Tips</h3>
            <ul className='list-disc list-inside space-y-1'>
              {result.safetyTips.map((tip, index) => (
                <li key={index} className='text-sm'>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className='text-lg font-semibold mb-2'>Recommended Actions</h3>
            <ul className='list-disc list-inside space-y-1'>
              {result.recommendedActions.map((action, index) => (
                <li key={index} className='text-sm'>
                  {action}
                </li>
              ))}
            </ul>
          </div>

          <section>
            <h3 className='text-lg font-semibold mb-2'>Summary</h3>
            <p className='text-sm'>{result.summary}</p>
          </section>
        </CardContent>
      </div>
      <CardFooter className='flex flex-col sm:flex-row gap-4'>
        <Button onClick={() => printFn()} className='w-full'>
          Print Analysis
        </Button>
        <Button
          onClick={readAnalysisAloud}
          // disabled={isReading || hasCompletedReading}
          className='w-full sm:w-1/2 bg-primary text-primary-foreground hover:bg-primary/90'
        >
          <Volume2 className='mr-2 h-4 w-4' />
          {isReading
            ? `Reading...`
            : hasCompletedReading
            ? `Read Analysis Aloud`
            : `Resume Reading`}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function ScamAnalysisView() {
  const sampleResult: ScamAnalysisResult = {
    isScam: true,
    overallThreatLevel: 'High',
    confidence: 92,
    potentialThreats: [
      {
        type: 'Phishing',
        description:
          'This message attempts to trick you into revealing sensitive information.',
        severity: 'High',
      },
      {
        type: 'Financial Scam',
        description:
          'The sender is trying to manipulate you into sending money.',
        severity: 'High',
      },
      {
        type: 'Identity Theft',
        description:
          'The scammer may be attempting to steal your personal information.',
        severity: 'Medium',
      },
    ],
    suspiciousElements: [
      {
        type: 'URL',
        value: 'http://fakebank-secure.com',
        reason:
          'This URL mimics a legitimate bank website but is not authentic.',
      },
      {
        type: 'Email Address',
        value: 'support@fakebank-secure.com',
        reason: 'This email address is not associated with the real bank.',
      },
      {
        type: 'Text Content',
        value: "Urgent: Your account will be closed if you don't act now!",
        reason: 'Creates a false sense of urgency to manipulate you.',
      },
    ],
    safetyTips: [
      'Never click on suspicious links in emails or messages.',
      "Always verify the sender's identity before sharing any information.",
      'Be wary of messages that create a sense of urgency or fear.',
      'Contact your bank directly using their official website or phone number if you have concerns.',
    ],
    recommendedActions: [
      'Do not respond to this message or click any links.',
      'Report this email as phishing to your email provider.',
      "If you've already clicked any links, change your passwords immediately.",
      'Monitor your bank accounts and credit report for any suspicious activity.',
    ],
    summary:
      'This message shows multiple signs of being a sophisticated phishing attempt. It tries to create urgency and fear to manipulate you into revealing sensitive financial information or sending money. The sender is impersonating a bank, but the email address and website URL are fake. Please exercise extreme caution and do not engage with this message in any way.',
  }

  return (
    <section>
      <h1 className='text-4xl font-bold text-center mb-8'>
        Scam Analysis Result
      </h1>
      <ScamAnalysis result={sampleResult} />
    </section>
  )
}
