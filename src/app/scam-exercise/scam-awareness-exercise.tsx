'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '&/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '&/components/ui/card'
import { Progress } from '&/components/ui/progress'
import { AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '&/lib/utils'

type Scenario = {
  id: number
  description: string
  isScam: boolean
  explanation: string
}

const scenarios = [
  {
    id: 1,
    description: `You receive an email claiming youʼve won a lottery you never entered. They ask for your bank details to transfer the winnings.`,
    isScam: true,
    explanation: `This is a classic lottery scam. You canʼt win a lottery you didnʼt enter, and legitimate lotteries never ask for bank details via email.`,
  },
  {
    id: 2,
    description: `Your bank sends you a text message alert about unusual activity on your account and provides a phone number to call.`,
    isScam: false,
    explanation: `While you should always be cautious, banks do send legitimate alerts. However, always verify by calling the number on your bank card, not the one in the message.`,
  },
  {
    id: 3,
    description: `A pop-up appears on your computer saying itʼs infected with a virus and you need to call a provided number immediately.`,
    isScam: true,
    explanation: `This is a tech support scam. Legitimate antivirus software doesnʼt use pop-ups with phone numbers. Always use official channels to get tech support.`,
  },
  {
    id: 4,
    description: `You receive a call from your grandchild saying theyʼre in trouble and need money urgently, but to keep it a secret from their parents.`,
    isScam: true,
    explanation: `This is known as the 'grandparent scam'. Always verify independently by calling your grandchild or their parents directly using a number you trust.`,
  },
  {
    id: 5,
    description: `Your credit card company emails you about a suspicious transaction and asks you to confirm if it was you.`,
    isScam: false,
    explanation: `Credit card companies do monitor for suspicious activity. However, they typically ask you to confirm or deny charges, not provide personal information. Always log in to your account directly rather than clicking email links.`,
  },
]

export function ScamAwarenessExercise() {
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null)
  const [score, setScore] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [exerciseOver, setExerciseOver] = useState(false)

  const nextScenario = useCallback(() => {
    const nextQuestionIndex = currentQuestionIndex + 1
    if (nextQuestionIndex >= scenarios.length) {
      setExerciseOver(true)
      return
    }
    setCurrentQuestionIndex(nextQuestionIndex)
    setCurrentScenario(scenarios[nextQuestionIndex])
    setShowExplanation(false)
    setIsCorrect(null)
  }, [currentQuestionIndex])

  const startNewExercise = useCallback(() => {
    setScore(0)
    setCurrentQuestionIndex(0)
    setExerciseOver(false)
    setCurrentScenario(scenarios[0])
    setShowExplanation(false)
    setIsCorrect(null)
  }, [])

  function handleAnswer(answer: boolean) {
    if (!currentScenario) return
    const correct = answer === currentScenario.isScam
    setIsCorrect(correct)
    setScore(prevScore => (correct ? prevScore + 1 : prevScore))
    setShowExplanation(true)
  }

  const progressPercentage = (score / scenarios.length) * 100

  useEffect(() => {
    startNewExercise()
  }, [startNewExercise])

  return (
    <Card className='w-full max-w-2xl mx-auto'>
      <CardHeader>
        <CardTitle className='text-3xl font-bold text-center'>
          Scam Awareness Exercise
        </CardTitle>
        <CardDescription className='text-center'>
          Can you identify the scams? Test your knowledge!
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!exerciseOver ? (
          <>
            <Progress value={progressPercentage} className='mb-4' />
            <p className='text-lg mb-4'>
              Scenario {currentQuestionIndex + 1} of {scenarios.length}
            </p>
            <p className='text-xl mb-6'>{currentScenario?.description}</p>
            <div className='flex justify-center space-x-4 mb-6'>
              <Button
                onClick={() => handleAnswer(true)}
                disabled={showExplanation}
                className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
              >
                <AlertTriangle className='mr-2 h-4 w-4' /> Itʼs a Scam
              </Button>
              <Button
                onClick={() => handleAnswer(false)}
                disabled={showExplanation}
                className='bg-success text-success-foreground hover:bg-success/90'
              >
                <CheckCircle className='mr-2 h-4 w-4' /> Itʼs Safe
              </Button>
            </div>
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    `p-4 rounded-lg`,
                    isCorrect ? `bg-success/20` : `bg-destructive/20`
                  )}
                >
                  <p className='font-bold mb-2'>
                    {isCorrect ? (
                      <span className='text-success flex items-center'>
                        <CheckCircle className='mr-2' /> Correct!
                      </span>
                    ) : (
                      <span className='text-destructive flex items-center'>
                        <XCircle className='mr-2' /> Incorrect
                      </span>
                    )}
                  </p>
                  <p>{currentScenario?.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div className='text-center'>
            <h3 className='text-2xl font-bold mb-4'>Exercise Complete!</h3>
            <p className='text-xl mb-4'>
              Your Score: {score} out of {scenarios.length}
            </p>
            <p className='mb-6'>
              {score === scenarios.length
                ? `Perfect score! You're a scam-awareness expert!`
                : score >= scenarios.length / 2
                ? `Great job! You're well on your way to becoming more scam-aware.`
                : `Keep practicing! The more you learn, the better you'll be at spotting scams.`}
            </p>
            <Button
              onClick={startNewExercise}
              className='bg-primary text-primary-foreground hover:bg-primary/90'
            >
              <RefreshCw className='mr-2 h-4 w-4' /> Try Again
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className='justify-between'>
        <p>
          Score: {score}/{currentQuestionIndex + 1}
        </p>
        {!exerciseOver && showExplanation && (
          <Button onClick={nextScenario}>Next Scenario</Button>
        )}
      </CardFooter>
    </Card>
  )
}
