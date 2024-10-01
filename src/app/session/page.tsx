'use client'

import {
  ArrowLeft,
  Stethoscope,
  Lightbulb,
  MessageCircle,
  Send,
} from 'lucide-react'
import { Button } from '&/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '&/components/ui/card'
import { ScrollArea } from '&/components/ui/scroll-area'
import { Textarea } from '&/components/ui/textarea'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '&/components/ui/accordion'
import { ChatUI } from './chat-ui'

function NewSession() {
  const [inputType, setInputType] = useState<'photo' | 'text' | 'voice'>(
    'photo'
  )
  const router = useRouter()

  const handleSubmit = async (data: any) => {
    // Send data to AI for analysis
    // Redirect to session dashboard with result
    router.push('/session')
  }

  return (
    <div>
      <h1>New Session</h1>
      {/* Input selection buttons */}
      {/* Input component based on selection */}
      <button onClick={() => handleSubmit(/* input data */)}>
        Get Diagnosis
      </button>
    </div>
  )
}

export default function SessionDashboard() {
  return (
    <div className='p-4'>
      <h2>Diagnosis Session.</h2>
      <div className='flex mt-6'>
        <ChatUI />
        <Card className='w-full max-w-md mx-auto bg-white shadow-lg rounded-2xl overflow-hidden'>
          <CardHeader className='bg-blue-600 text-white p-6 flex flex-row items-center'>
            <Button variant='ghost' size='icon' className='mr-2 text-white'>
              <ArrowLeft className='h-6 w-6' />
            </Button>
            <CardTitle className='text-xl font-bold'>
              Session Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6 space-y-6'>
            <div className='space-y-4'>
              <h2 className='text-lg md:text-xl font-semibold flex items-center'>
                <Stethoscope className='mr-2 h-5 w-5 text-blue-500' />
                Current Diagnosis
              </h2>
              <p className='text-gray-700 bg-blue-50 p-3 rounded-lg'>
                Possible mild eczema on the forearm
              </p>
            </div>
            <div className='space-y-4'>
              <h2
                className='text-lg md:text-xl
             font-semibold flex items-center'
              >
                <Lightbulb className='mr-2 h-5 w-5 text-yellow-500' />
                AI Recommendations
              </h2>
              <ul className='list-disc list-inside text-gray-700 space-y-2'>
                <li>Apply a gentle, fragrance-free moisturizer regularly</li>
                <li>Avoid hot showers and use lukewarm water</li>
                <li>Consider using an over-the-counter hydrocortisone cream</li>
                <li>If symptoms persist, consult a dermatologist</li>
              </ul>
            </div>
            <Accordion type='single' collapsible>
              <AccordionItem value='item-1'>
                <AccordionTrigger>
                  <h3 className='text-lg md:text-xl font-semibold'>
                    Treatment Recommendations
                  </h3>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className='list-disc pl-5'>
                    <li>Apply moisturizer regularly</li>
                    <li>Avoid triggers like harsh soaps</li>
                    <li>Use a prescribed topical corticosteroid</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value='item-2'>
                <AccordionTrigger>
                  <h3 className='text-lg md:text-xl font-semibold'>
                    Next Steps
                  </h3>
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    Schedule an appointment with a dermatologist for
                    confirmation and personalized treatment.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className='space-y-4'>
              <h2 className='text-lg font-semibold flex items-center'>
                <MessageCircle className='mr-2 h-5 w-5 text-green-500' />
                Session History
              </h2>
              <ScrollArea className='h-40 rounded-md border p-4'>
                <div className='space-y-4'>
                  <p>
                    <strong>You:</strong> I have a red, itchy patch on my
                    forearm.
                  </p>
                  <p>
                    <strong>AI:</strong> Can you describe the size and texture
                    of the patch?
                  </p>
                  <p>
                    <strong>You:</strong> It's about the size of a quarter and
                    feels slightly rough.
                  </p>
                  <p>
                    <strong>AI:</strong> Based on your description, it could be
                    mild eczema. Let me provide some recommendations...
                  </p>
                </div>
              </ScrollArea>
            </div>
            <div className='space-y-4'>
              <h2 className='text-lg font-semibold'>Follow-up Question</h2>
              <Textarea
                placeholder='Ask a follow-up question...'
                className='min-h-[100px]'
              />
              <Button className='w-full'>
                <Send className='mr-2 h-4 w-4' />
                Send Question
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
