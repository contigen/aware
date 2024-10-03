'use client'

import { Button } from '&/components/ui/button'
import { Textarea } from '&/components/ui/textarea'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {
  AlertTriangle,
  MessageSquare,
  Send,
  ThumbsUp,
  Upload,
  X,
} from 'lucide-react'
import { Input } from '&/components/ui/input'

interface ScamAnalysisResult {
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

export default function Page() {
  const [suspiciousText, setSuspiciousText] = useState('')
  const [analysisResult, setAnalysisResult] =
    useState<ScamAnalysisResult | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [currentMessage, setCurrentMessage] = useState('')
  const chatContainerRef = useRef(null)

  const handleFileUpload = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setUploadedFile(file)
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
    } else {
      alert('Please upload a valid image file.')
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setUploadedFile(file)
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
    } else {
      alert('Please upload a valid image file.')
    }
  }

  const removeUploadedFile = () => {
    setUploadedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleAnalyze = () => {
    // Simulated analysis result
    setAnalysisResult({
      isScam: true,
      confidence: 85,
      reasons: [
        'Urgent action required',
        'Requests personal information',
        'Suspicious sender email',
      ],
    })
  }

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      setChatMessages([
        ...chatMessages,
        { type: 'user', content: currentMessage },
      ])
      setCurrentMessage('')
      // Simulate AI response (replace with actual AI integration)
      setTimeout(() => {
        setChatMessages(prevMessages => [
          ...prevMessages,
          {
            type: 'ai',
            content:
              "I'm analyzing your message. It's important to be cautious about sharing personal information. Can you tell me more about the context of this message?",
          },
        ])
      }, 1000)
    }
  }

  return (
    <div className='p-4'>
      <section>
        <h2 className='text-3xl font-bold mb-6'>Analyze Suspicious Content</h2>
        <div className='mb-4'>
          <Button
            variant={isChatOpen ? 'outline' : 'default'}
            onClick={() => setIsChatOpen(false)}
            className='mr-2'
          >
            Quick Analysis
          </Button>
          <Button
            variant={isChatOpen ? 'default' : 'outline'}
            onClick={() => setIsChatOpen(true)}
          >
            <MessageSquare className='w-4 h-4 mr-2' />
            In-depth Conversation
          </Button>
        </div>
        {!isChatOpen ? (
          <>
            <Textarea
              className='w-full mb-4'
              placeholder='Paste suspicious text here...'
              rows={6}
              value={suspiciousText}
              onChange={e => setSuspiciousText(e.target.value)}
            />
            <div
              className='border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4 text-center cursor-pointer'
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type='file'
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept='image/*'
                style={{ display: 'none' }}
              />
              {uploadedFile ? (
                <div className='space-y-4'>
                  <div className='flex items-center justify-center'>
                    <span className='mr-2'>{uploadedFile.name}</span>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={e => {
                        e.stopPropagation()
                        removeUploadedFile()
                      }}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                  {previewUrl && (
                    <div className='mt-4'>
                      <p className='mb-2 font-bold'>Image Preview:</p>
                      <Image
                        src={previewUrl}
                        alt='Preview of uploaded image'
                        width={80}
                        height={80}
                        className='max-w-full mx-auto rounded-lg shadow-md'
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <Upload className='mx-auto h-12 w-12 text-gray-400' />
                  <p className='mt-2 text-sm text-gray-600'>
                    Click to upload or drag and drop
                  </p>
                  <p className='text-xs text-gray-500'>
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              )}
            </div>
            <Button
              size='lg'
              onClick={handleAnalyze}
              disabled={!suspiciousText && !uploadedFile}
            >
              Analyze
            </Button>
          </>
        ) : (
          <div className='border rounded-lg p-4'>
            <div ref={chatContainerRef} className='h-96 overflow-y-auto mb-4'>
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    message.type === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  <div
                    className={`inline-block p-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
            <div className='flex'>
              <Input
                type='text'
                placeholder='Type your message here...'
                value={currentMessage}
                onChange={evt => setCurrentMessage(evt.target.value)}
                onKeyUp={evt => evt.key === 'Enter' && handleSendMessage()}
                className='flex-grow mr-2'
              />
              <Button onClick={handleSendMessage}>
                <Send className='w-4 h-4' />
              </Button>
            </div>
          </div>
        )}
      </section>
      <div className='border rounded-lg p-4'>
        {analysisResult && (
          <div>
            <h2 className='text-3xl font-bold mb-6'>Analysis Results</h2>
            <div
              className={`p-6 rounded-lg mb-6 ${
                analysisResult.isScam ? 'bg-red-100' : 'bg-green-100'
              }`}
            >
              <div className='flex items-center mb-4'>
                {analysisResult.isScam ? (
                  <AlertTriangle className='text-red-500 mr-2' size={24} />
                ) : (
                  <ThumbsUp className='text-green-500 mr-2' size={24} />
                )}
                <span className='text-2xl font-bold'>
                  {analysisResult.isScam ? 'Likely a Scam' : 'Probably Safe'}
                </span>
              </div>
              <div className='mb-4'>
                <label className='block mb-2'>Confidence:</label>
                <div className='bg-gray-200 h-4 rounded-full overflow-hidden'>
                  <div
                    className={`h-full ${
                      analysisResult.isScam ? 'bg-red-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${analysisResult.confidence}%` }}
                  ></div>
                </div>
              </div>
              {analysisResult.isScam && (
                <div>
                  <h3 className='font-bold mb-2'>Why we think it’s a scam:</h3>
                  <ul className='list-disc list-inside'>
                    {analysisResult.reasons.map((reason, index) => (
                      <li key={index}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <Button
              onClick={() => {
                setSuspiciousText('')
                setUploadedFile(null)
                setPreviewUrl(null)
              }}
            >
              Analyze Another
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
