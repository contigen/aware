import { analyseText } from '&/action'
import { Button } from '&/components/ui/button'
import { Spinner } from '&/components/ui/spinner'
import { Textarea } from '&/components/ui/textarea'
import { toast } from '&/hooks/use-toast'
import { CoreMessage } from 'ai'
import { X, Upload, Clipboard } from 'lucide-react'
import {
  useState,
  ChangeEvent,
  FormEvent,
  DragEvent,
  useRef,
  SetStateAction,
  Dispatch,
} from 'react'
import Image from 'next/image'
import { ScamAnalysisResult } from '&/types'
import { cn } from '&/lib/utils'
import { ScamAnalysisView } from '&/components/scam-analysis'

export function QuickAnalysis({
  analysisResult,
  setAnalysisResult,
}: {
  analysisResult: ScamAnalysisResult | null
  setAnalysisResult: Dispatch<SetStateAction<ScamAnalysisResult | null>>
}) {
  const [suspiciousText, setSuspiciousText] = useState(``)

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  function readFile(file: File | undefined) {
    if (file && file.type.startsWith(`image/`)) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (reader.result) setPreviewUrl(reader.result.toString())
      }
      reader.readAsDataURL(file)
    } else {
      toast({
        title: `Invalid File Type`,
        description: `Please upload a valid image file.`,
        variant: `destructive`,
      })
    }
  }

  function handleFileUpload(evt: ChangeEvent<HTMLInputElement>) {
    setIsLoading(false)
    const file = evt.target.files?.[0]
    readFile(file)
  }

  function handleDragOver(evt: DragEvent<HTMLDivElement>) {
    evt.preventDefault()
    setIsDragging(true)
  }
  function handleDragEnter(evt: DragEvent<HTMLDivElement>) {
    evt.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(evt: DragEvent<HTMLDivElement>) {
    evt.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (evt: DragEvent<HTMLDivElement>) => {
    evt.preventDefault()
    setIsDragging(false)
    const file = evt.dataTransfer.files[0]
    readFile(file)
  }

  async function handlePaste() {
    try {
      const clipboardItems = await navigator.clipboard.read()
      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (type.startsWith(`image/`)) {
            const blob = await clipboardItem.getType(type)
            const file = new File([blob], `pasted-image`, { type: blob.type })
            readFile(file)
            return
          } else {
            toast({
              title: `No image found`,
              description: `There's no image in your clipboard. Try copying an image first or use the file upload.`,
            })
          }
        }
      }
    } catch {
      toast({
        title: `Clipboard access denied`,
        description: `Please aclsxllow clipboard access and try again.`,
        variant: `destructive`,
      })
    }
  }

  async function handleSubmit(evt: FormEvent) {
    evt.preventDefault()
    setIsLoading(true)
    const userMessage: CoreMessage = {
      role: `user`,
      content: previewUrl
        ? [
            { type: `text`, text: suspiciousText || `Analyse the image` },
            { type: `image`, image: previewUrl },
          ]
        : suspiciousText,
    }
    try {
      const analysisResult = await analyseText([userMessage])
      setAnalysisResult(analysisResult)
    } catch {
      toast({
        title: `Error`,
        description: `Server error, please try again later.`,
        variant: `destructive`,
      })
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <section>
      <form onSubmit={handleSubmit}>
        <Textarea
          className='w-full mb-4'
          placeholder='Paste suspicious text here...'
          rows={6}
          value={suspiciousText}
          onChange={evt => {
            setIsLoading(false)
            setSuspiciousText(evt.target.value)
          }}
          ref={textAreaRef}
        />
        {!analysisResult && (
          <>
            <div
              className={cn(
                `border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4 text-center cursor-pointer`,
                isDragging && `border-dotted`
              )}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type='file'
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept='image/*'
                className='hidden'
              />
              {previewUrl ? (
                <div>
                  <Button
                    variant='ghost'
                    onClick={evt => {
                      evt.stopPropagation()
                      setPreviewUrl(null)
                    }}
                    className='rounded-xl'
                  >
                    <X className='w-4 h-4' />
                  </Button>
                  <p className='mb-2 font-bold'>Image Preview:</p>
                  <Image
                    src={previewUrl}
                    alt='Preview of uploaded image'
                    width={80}
                    height={80}
                    className='max-w-full mx-auto rounded-lg shadow-md w-28 h-28 object-cover'
                  />
                </div>
              ) : (
                <div>
                  <Upload className='mx-auto h-12 w-12 text-gray-400' />
                  <p className='mt-2 text-sm text-gray-600'>
                    Click to upload or drag and drop
                  </p>
                  <p className='text-xs text-gray-500'>PNG, JPG, GIF</p>
                  <br />
                  <Button
                    type='button'
                    onClick={evt => {
                      evt.stopPropagation()
                      handlePaste()
                    }}
                  >
                    <Clipboard className='mr-2 h-4 w-4' /> Paste Image
                  </Button>
                </div>
              )}
            </div>
            <>
              {isLoading ? (
                Spinner
              ) : (
                <Button size='lg' disabled={!suspiciousText && !previewUrl}>
                  Analyze
                </Button>
              )}
            </>
          </>
        )}
      </form>
      {analysisResult && (
        <>
          <ScamAnalysisView result={analysisResult} />
          <Button
            onClick={() => {
              setSuspiciousText(``)
              setPreviewUrl(null)
              setAnalysisResult(null)
              textAreaRef.current?.focus()
            }}
          >
            Analyze Another
          </Button>
        </>
      )}
    </section>
  )
}
