'use client'

import { useState, useRef, useEffect, ChangeEvent, FormEvent } from 'react'
import { Button } from '&/components/ui/button'
import { Input } from '&/components/ui/input'
import { ScrollArea } from '&/components/ui/scroll-area'
import { Card, CardContent } from '&/components/ui/card'
import { ArrowUp, Camera, Mic, Paperclip, Webcam, X } from 'lucide-react'
import { toast } from '&/hooks/use-toast'
import Image from 'next/image'
import { CoreMessage } from 'ai'
import { sendPromptToAI } from '&/action'
import { readStreamableValue } from 'ai/rsc'
import Cam from 'react-webcam'

type Message = CoreMessage & { dataURL?: string }

export function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const webcamRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: `smooth` })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (evt: FormEvent) => {
    evt.preventDefault()
    if (inputText.trim() || mediaPreview) {
      const newUserMessage: CoreMessage = {
        role: `user`,
        content: mediaPreview
          ? [
              { type: `text`, text: inputText },
              { type: `image`, image: mediaPreview },
            ]
          : inputText,
      }
      const newMessages = [...messages, newUserMessage]
      setMessages(newMessages)
      setIsCapturing(false)
      setInputText(``)
      setMediaPreview(null)

      const result = await sendPromptToAI(newMessages)

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

  const startSpeechRec = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      toast({
        title: `Speech Recognition Unavailable`,
        description: `Your browser doesn't support speech recognition. Please try using a different browser or input your message manually.`,
        variant: `destructive`,
      })
      return
    }

    const recognition = new SpeechRecognition()

    recognition.onresult = event => {
      const transcript = event.results[0][0].transcript
      setInputText(prevText => `${prevText} ${transcript}`)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.onerror = event => {
      console.error(`Speech recognition error`, event.error)
      setIsListening(false)
      toast({
        title: `Speech Recognition Error`,
        description: `An error occurred: ${event.error}. Please try again or input your message manually.`,
        variant: `destructive`,
      })
    }

    try {
      recognition.start()
      setIsListening(true)
    } catch (err: any) {
      setIsListening(false)
      toast({
        title: `Speech Recognition Error`,
        description: `Failed to start speech recognition. ${err.message}`,
        variant: `destructive`,
      })
    }
  }

  const handleFileUpload = (evt: ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setMediaPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeMedia = () => {
    setMediaPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const capture = () => {
    setIsCapturing(true)
    // @ts-ignore
    const imageSrc = webcamRef.current?.getScreenshot()
    setMediaPreview(imageSrc)
  }

  return (
    <Card className='w-full max-w-md mx-auto h-[600px] flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden rounded-3xl shadow-2xl border border-gray-200'>
      <CardContent className='flex-grow flex flex-col p-0 h-full'>
        <div className='bg-gradient-to-b from-[#00C6FF] to-[#0072FF] p-4 text-white text-center font-semibold rounded-b-3xl shadow-md'>
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
                  className={`max-w-[70%] p-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-[#0B93F6] text-white'
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
            {isCapturing ? (
              <Cam
                audio={false}
                height={80}
                ref={webcamRef}
                screenshotFormat='image/jpeg'
                width={142}
                videoConstraints={{
                  facingMode: `environment`,
                  width: 142,
                  height: 80,
                }}
              />
            ) : (
              mediaPreview && (
                <div className='relative mb-2'>
                  <Image
                    src={mediaPreview}
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
              )
            )}
            <div className='flex items-center space-x-2 bg-white rounded-full px-4 py-2'>
              <Input
                type='text'
                placeholder='iMessage'
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
                onClick={capture}
                size='icon'
                variant='ghost'
                className='rounded-full'
                aria-label='Capture photo or video'
              >
                <Camera className='h-4 w-4' />
              </Button>
              <Button
                onClick={startSpeechRec}
                size='icon'
                variant='ghost'
                className={`rounded-full ${
                  isListening ? 'bg-red-500 text-white' : ''
                }`}
                aria-label='Voice input'
                type='button'
              >
                <Mic className='h-4 w-4' />
              </Button>

              <Button
                type='submit'
                size='icon'
                className='rounded-full bg-[#0B93F6] hover:bg-[#0A84E7] transition-colors duration-300 shadow-md hover:shadow-lg transform hover:scale-105'
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
