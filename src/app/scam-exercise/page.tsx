import React from 'react'
import { ScamAwarenessExercise } from './scam-awareness-exercise'

export const metadata = {
  title: `Scam Awareness Exercise | Aware`,
  description: `Test your knowledge and learn how to identify scams with our interactive Scam Awareness Exercise.`,
}

export default function Page() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-center mb-8'>Scam Awareness Exercise</h1>
      <p className='text-lg md:text-xl text-center mb-8'>
        Welcome to the Scam Awareness Exercise! This interactive quiz will test
        your ability to identify potential scams. Itʼs a practical way to learn
        about different scam tactics and improve your scam detection skills.
      </p>
      <ScamAwarenessExercise />
      <div className='mt-8 text-center'>
        <p className='md:text-lg'>
          Remember, staying informed is your best defense against scams. Keep
          practicing and stay vigilant in your daily life!
        </p>
      </div>
    </div>
  )
}
