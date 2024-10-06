'use client'

import { useState, useRef, useEffect, ChangeEvent, FormEvent } from 'react'
import { Button } from '&/components/ui/button'
import { Input } from '&/components/ui/input'
import { ScrollArea } from '&/components/ui/scroll-area'
import { Card, CardContent } from '&/components/ui/card'
import { ArrowUp, Mic, Paperclip, X } from 'lucide-react'
import { toast } from '&/hooks/use-toast'
import Image from 'next/image'
import { CoreMessage } from 'ai'
import { analyseChat } from '&/action'
import { readStreamableValue } from 'ai/rsc'
import { ScamAnalysisResult } from '&/types'
import { useSpeechRecognition } from '&/features/speech-recognition/use-speech-recognition'

type Message = CoreMessage & { dataURL?: string }

export function ChatUI({
  analysisResult,
}: {
  analysisResult: ScamAnalysisResult
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const {
    Recognition,
    startSpeechRec,
    stopSpeechRec,
    transcript: { preview, note },
  } = useSpeechRecognition()

  function handleSpeechRec() {
    if (!Recognition) {
      toast({
        title: `Speech Recognition Unavailable`,
        description: `Your browser doesn't support speech recognition. Please try using a different browser or input your message manually.`,
        variant: `destructive`,
      })
      return
    }
    setIsListening(prev => !prev)
    if (isListening) {
      stopSpeechRec()
    } else {
      startSpeechRec()
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: `smooth` })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (evt: FormEvent) => {
    evt.preventDefault()
    if (inputText.trim() || previewUrl) {
      const newUserMessage: CoreMessage = {
        role: `user`,
        content: previewUrl
          ? [
              { type: `text`, text: inputText },
              { type: `image`, image: previewUrl },
            ]
          : inputText,
      }
      const newMessages = [...messages, newUserMessage]
      setMessages(newMessages)
      setInputText(``)
      setPreviewUrl(null)

      const result = await analyseChat(newMessages, analysisResult)

      for await (const content of readStreamableValue(result)) {
        setMessages([
          ...newMessages,
          {
            role: `assistant`,
            content: content as string,
          },
        ])
      }
    }
  }

  const handleFileUpload = (evt: ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeMedia = () => {
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  useEffect(() => {
    if (note) {
      setInputText(note)
    } else setInputText(preview)
  }, [note, preview])

  return (
    <Card className='h-[600px] flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden rounded-3xl shadow border border-gray-200'>
      <CardContent className='flex-grow flex flex-col p-0 h-full'>
        <div className='bg-gradient-to-b from-blue-500 from-10% to-[#0072FF] p-4 text-white text-center font-semibold rounded-b-3xl shadow-md'>
          Chat with AI
        </div>
        <ScrollArea
          className='flex-grow px-4 py-6 h-[calc(100%-8rem)]'
          ref={scrollAreaRef}
        >
          <div className='flex flex-col space-y-4'>
            {messages.map((message, idx) => (
              <div
                key={idx}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                } mb-4`}
              >
                <div
                  className={`max-w-[70%] break-words p-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-[#E5E5EA] text-black'
                  } ${
                    idx > 0 && messages[idx - 1].role === message.role
                      ? message.role === 'user'
                        ? 'rounded-tr-md'
                        : 'rounded-tl-md'
                      : ''
                  }`}
                >
                  <p className='text-sm'>{message.content.toString()}</p>
                </div>
              </div>
            ))}
            {/* empty div as anchor for auto-scroll */}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit}>
          <div className='p-4 bg-[#F5F5F5] border-t border-gray-200'>
            {previewUrl && (
              <div className='relative mb-2'>
                <Image
                  src={previewUrl}
                  alt='Media preview'
                  width={80}
                  height={80}
                  className='object-cover rounded-lg'
                />
                <Button
                  size='icon'
                  variant='destructive'
                  className='absolute -top-2 -right-2 rounded-full w-6 h-6'
                  onClick={removeMedia}
                >
                  <X className='w-4 h-4' />
                </Button>
              </div>
            )}
            <div className='flex items-center space-x-2 bg-white rounded-full px-4 py-2'>
              <Input
                type='text'
                placeholder='Provide text for analysis...'
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                className='flex-grow border-none focus:ring-0 bg-transparent text-sm'
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                size='icon'
                variant='ghost'
                className='rounded-full'
                aria-label='Upload media'
                type='button'
              >
                <Paperclip className='h-4 w-4' />
              </Button>
              <input
                type='file'
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept='image/*,video/*'
                className='hidden'
              />
              <Button
                onClick={handleSpeechRec}
                size='icon'
                variant='ghost'
                className={`rounded-full ${
                  isListening ? `bg-red-500 text-white` : ``
                }`}
                aria-label='Voice input'
                type='button'
              >
                <Mic className='h-4 w-4' />
              </Button>

              <Button
                type='submit'
                size='icon'
                className='rounded-full bg-gray-800 hover:bg-gray-900 transition-colors duration-300 shadow-md hover:shadow-lg transform hover:scale-105'
                aria-label='Send message'
              >
                <ArrowUp className='h-4 w-4 text-white' />
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
