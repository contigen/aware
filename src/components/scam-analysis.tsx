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
import {
  SuspiciousElementType,
  ThreatType,
  ThreatLevel,
  ScamAnalysisResult,
} from '&/types'

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
  Low: `bg-success text-success-foreground`,
  Medium: `bg-warning text-warning-foreground`,
  High: `bg-destructive text-destructive-foreground`,
}

function ScamAnalysis({ result }: { result: ScamAnalysisResult }) {
  const confidence = result.confidence * 100
  const contentRef = useRef<HTMLDivElement>(null)
  const printFn = useReactToPrint({
    contentRef,
  })

  const [isReading, setIsReading] = useState(false)
  const [hasCompletedReading, setHasCompletedReading] = useState(false)

  const readableSummary = generateReadableSummary(result)
  const { speak, pause, resume, speechSynthOptions, errMessage } =
    useSpeechSynthesis(readableSummary, () => setHasCompletedReading(true))
  useSpeechSynthesis(readableSummary)

  const readAnalysisAloud = () => {
    console.log(`Current state:`, speechSynthOptions)
    if (errMessage) {
      toast({
        title: `Text-to-Speech not supported`,
        description: `Your browser does not support text-to-speech functionality.`,
        variant: `destructive`,
      })
      return
    }

    if (isReading) {
      if (speechSynthOptions.paused) {
        resume()
      } else {
        pause()
      }
    } else {
      speak()
    }
    setIsReading(!isReading)
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
            <Progress value={confidence} className='w-full' />
            <p className='text-sm text-muted-foreground mt-1'>
              {confidence}% confident in this assessment
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
          disabled={hasCompletedReading}
          className='w-full sm:w-1/2 bg-primary text-primary-foreground hover:bg-primary/90'
        >
          <Volume2 className='mr-2 h-4 w-4' />
          {isReading
            ? speechSynthOptions.paused
              ? 'Paused'
              : 'Reading...'
            : hasCompletedReading
            ? 'Finished Reading'
            : 'Read Analysis Aloud'}
        </Button>
      </CardFooter>
    </Card>
  )
}

export function ScamAnalysisView({ result }: { result: ScamAnalysisResult }) {
  return (
    <section className='my-8'>
      <h2 className='text-3xl font-bold text-center mb-4'>
        Scam Analysis Result
      </h2>
      <ScamAnalysis result={result} />
    </section>
  )
}
