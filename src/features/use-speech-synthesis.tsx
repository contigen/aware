import { useState, useEffect, useCallback, useRef } from 'react'

type SpeechSynthOptions = {
  paused: boolean
  speaking: boolean
}

export function useSpeechSynthesis(text: string) {
  const [speechSynth, setSpeechSynth] = useState<SpeechSynthesis | null>(null)
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(
    null
  )
  const [speechSynthOptions, setSpeechSynthOptions] =
    useState<SpeechSynthOptions>({
      paused: false,
      speaking: false,
    })
  const [errMessage, setErrMessage] = useState(``)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    try {
      const synth = window.speechSynthesis
      if (!synth) {
        throw new Error('speechSynthesis not available')
      }
      const utter = new SpeechSynthesisUtterance(text)
      setSpeechSynth(synth)
      setUtterance(utter)
    } catch (err) {
      console.error('Speech synthesis initialization error:', err)
      setErrMessage(`Speech synthesis initialization error: ${err}`)
    }
  }, [text])

  const clearIntervalIfAny = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!utterance) return

    const onStart = () => {
      setSpeechSynthOptions({ speaking: true, paused: false })

      // Chrome time outs around 15s, a workaround
      if (intervalRef.current === null) {
        intervalRef.current = window.setInterval(() => {
          if (speechSynth && !speechSynth.speaking) {
            clearIntervalIfAny()
            setSpeechSynthOptions({ speaking: false, paused: false })
          } else {
            speechSynth?.pause()
            speechSynth?.resume()
          }
        }, 14000)
      }
    }
    const onPause = () => {
      setSpeechSynthOptions({ speaking: true, paused: true })
    }
    const onResume = () => {
      setSpeechSynthOptions({ speaking: true, paused: false })
    }
    const onEnd = () => {
      setSpeechSynthOptions({ speaking: false, paused: false })
      clearIntervalIfAny()
    }
    const onError = (evt: SpeechSynthesisErrorEvent) => {
      setSpeechSynthOptions({ speaking: false, paused: false })
      setErrMessage(`Speech synthesis error: ${evt.error}`)
      clearIntervalIfAny()
    }

    utterance.onstart = onStart
    utterance.onpause = onPause
    utterance.onresume = onResume
    utterance.onend = onEnd
    utterance.onerror = onError

    return () => {
      utterance.onstart = null
      utterance.onpause = null
      utterance.onresume = null
      utterance.onend = null
      utterance.onerror = null
      clearIntervalIfAny()
    }
  }, [utterance, speechSynth, clearIntervalIfAny])

  const speak = useCallback(() => {
    if (speechSynth && utterance) {
      utterance.rate = 0.9
      utterance.text = text
      speechSynth.cancel() // Cancel any ongoing speech
      speechSynth.speak(utterance)
    }
  }, [speechSynth, utterance, text])

  const pause = useCallback(() => {
    if (speechSynth) {
      speechSynth.pause()
      clearIntervalIfAny()
    }
  }, [speechSynth, clearIntervalIfAny])

  const resume = useCallback(() => {
    if (speechSynth) {
      speechSynth.resume()
    }
  }, [speechSynth])

  const cancel = useCallback(() => {
    if (speechSynth) {
      speechSynth.cancel()
      clearIntervalIfAny()
      setSpeechSynthOptions({ speaking: false, paused: false })
    }
  }, [speechSynth, clearIntervalIfAny])

  return {
    speechSynth,
    speak,
    pause,
    resume,
    cancel,
    speechSynthOptions,
    errMessage,
  }
}
