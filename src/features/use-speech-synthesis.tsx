import { stateField } from '&/types'
import { useState } from 'react'

let speechSynth: SpeechSynthesis | undefined
let utterance: SpeechSynthesisUtterance | undefined
if (typeof window !== `undefined`) {
  try {
    speechSynth = speechSynthesis
    utterance = new SpeechSynthesisUtterance()
  } catch {
    speechSynth = undefined
  }
}

export function useSpeechSynthesis(_utterance: string, onEnd?: () => void) {
  const [speechSynthOptions, setSpeechSynthOptions] = useState({
    paused: speechSynth?.paused,
    speaking: speechSynth?.speaking,
  })
  const [errMessage, setErrMessage] = useState(``)
  type synthOptionsType = typeof speechSynthOptions
  const updateStateConfig = (stateValue: stateField<synthOptionsType>) => {
    setSpeechSynthOptions(prev => ({ ...prev, ...stateValue }))
  }

  function modifyUtteranceRate() {
    if (utterance) {
      utterance.rate = 0.9
      utterance.text = _utterance
    }
  }
  function speak() {
    modifyUtteranceRate()
    if (utterance) speechSynth?.speak(utterance)

    updateStateConfig({ speaking: true })
  }
  function pause() {
    speechSynth?.pause()
    updateStateConfig({ paused: true })
  }
  function resume() {
    speechSynth?.resume()
    updateStateConfig({ paused: false })
  }
  if (utterance) {
    utterance.onstart = () => {
      updateStateConfig({ speaking: true })
    }
    utterance.onpause = evt => {
      console.log(speechSynth?.paused)
      console.log(speechSynth?.speaking)
      console.log(evt)
      updateStateConfig({ paused: true })
    }
    utterance.onend = () => {
      onEnd?.()
      console.log('utterance.onend')
      updateStateConfig({ speaking: false })
    }
    utterance.onerror = evt => {
      updateStateConfig({ speaking: false })
      setErrMessage(evt.error)
    }
  }
  return { speechSynth, speak, pause, resume, speechSynthOptions, errMessage }
}
