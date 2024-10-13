'use client'

import { Button } from '&/components/ui/button'
import { MessageSquare } from 'lucide-react'
import { ChatUI } from './chat'
import { ScamAnalysisResult } from '&/types'
import { useState } from 'react'
import { QuickAnalysis } from './quick-analysis'

export default function Page() {
  const [analysisResult, setAnalysisResult] =
    useState<ScamAnalysisResult | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <div className='p-4'>
      <section>
        <h2 className='text-3xl font-bold mb-6'>Analyse Suspicious Content</h2>
        <div className='mb-4'>
          <Button
            variant={isChatOpen ? 'outline' : 'default'}
            onClick={() => setIsChatOpen(false)}
            className='mr-2'
          >
            Quick Analysis
          </Button>
          <Button
            variant={isChatOpen ? `default` : `outline`}
            onClick={() => setIsChatOpen(true)}
          >
            <MessageSquare className='w-4 h-4 mr-2' />
            In-depth Analysis
          </Button>
        </div>
        {!isChatOpen ? (
          <QuickAnalysis {...{ analysisResult, setAnalysisResult }} />
        ) : (
          <ChatUI analysisResult={analysisResult as ScamAnalysisResult} />
        )}
      </section>
    </div>
  )
}
