'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '&/components/ui/button'
import { Textarea } from '&/components/ui/textarea'

import {
  AlertTriangle,
  ThumbsUp,
  Upload,
  Shield,
  Eye,
  Phone,
  X,
} from 'lucide-react'
import Image from 'next/image'

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

export function ScamDetection() {
  const [activeSection, setActiveSection] = useState('home')
  const [analysisResult, setAnalysisResult] =
    useState<ScamAnalysisResult | null>(null)
  const [suspiciousText, setSuspiciousText] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

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
    setActiveSection('results')
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0]
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

  return (
    <div className='min-h-screen text-gray-800'>
      <header className='bg-blue-600 text-white p-4'>
        <nav className='container mx-auto flex justify-between items-center'>
          <h1 className='text-2xl font-bold'>Scam Detection Helper</h1>
          <ul className='flex space-x-4'>
            <li>
              <Button variant='ghost' onClick={() => setActiveSection('home')}>
                Home
              </Button>
            </li>
            <li>
              <Button
                variant='ghost'
                onClick={() => setActiveSection('detect')}
              >
                Detect
              </Button>
            </li>
            <li>
              <Button variant='ghost' onClick={() => setActiveSection('learn')}>
                Learn
              </Button>
            </li>
            <li>
              <Button variant='ghost' onClick={() => setActiveSection('about')}>
                About
              </Button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main content */}
      <main className='flex-grow container mx-auto p-8'>
        {activeSection === 'home' && (
          <div className='text-center'>
            <h2 className='text-4xl font-bold mb-6'>Stay Safe from Scams</h2>
            <p className='text-xl mb-8'>
              Our AI-powered tool helps you identify potential scams in emails
              and messages.
            </p>
            <Button size='lg' onClick={() => setActiveSection('detect')}>
              Get Started
            </Button>
          </div>
        )}

        {activeSection === 'detect' && (
          <div>
            <h2 className='text-3xl font-bold mb-6'>
              Analyze Suspicious Content
            </h2>
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
                        width={100}
                        height={100}
                        className='max-w-full h-auto max-h-64 mx-auto rounded-lg shadow-md'
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
          </div>
        )}

        {activeSection === 'results' && analysisResult && (
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
                  <h3 className='font-bold mb-2'>Why we think it's a scam:</h3>
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
                setActiveSection('detect')
                setSuspiciousText('')
                setUploadedFile(null)
                setPreviewUrl(null)
              }}
            >
              Analyze Another
            </Button>
          </div>
        )}

        {activeSection === 'learn' && (
          <div>
            <h2 className='text-3xl font-bold mb-6'>Tips to Avoid Scams</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='flex items-start'>
                <Shield className='text-blue-500 mr-4' size={24} />
                <div>
                  <h3 className='font-bold mb-2'>
                    Be Cautious with Personal Information
                  </h3>
                  <p>
                    Never share sensitive details unless you're certain of the
                    recipient's identity.
                  </p>
                </div>
              </div>
              <div className='flex items-start'>
                <Eye className='text-blue-500 mr-4' size={24} />
                <div>
                  <h3 className='font-bold mb-2'>Verify Sender's Identity</h3>
                  <p>
                    Double-check email addresses and website URLs for
                    authenticity.
                  </p>
                </div>
              </div>
              <div className='flex items-start'>
                <AlertTriangle className='text-blue-500 mr-4' size={24} />
                <div>
                  <h3 className='font-bold mb-2'>Be Wary of Urgency</h3>
                  <p>
                    Scammers often create a false sense of urgency. Take your
                    time to verify.
                  </p>
                </div>
              </div>
              <div className='flex items-start'>
                <Phone className='text-blue-500 mr-4' size={24} />
                <div>
                  <h3 className='font-bold mb-2'>Call to Confirm</h3>
                  <p>
                    If in doubt, call the company directly using a number you
                    trust, not one provided in the message.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'about' && (
          <div>
            <h2 className='text-3xl font-bold mb-6'>
              About Scam Detection Helper
            </h2>
            <p className='mb-4'>
              Scam Detection Helper is a user-friendly tool designed to help
              senior citizens identify potential scams in emails and messages.
              Our AI-powered system analyzes content to detect common scam
              patterns and provides easy-to-understand results.
            </p>
            <p>
              We're committed to making the internet a safer place for everyone.
              If you have any questions or need assistance, please don't
              hesitate to contact our support team.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
