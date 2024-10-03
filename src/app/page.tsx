import { Button } from '&/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <div className=''>
      <main className='flex-grow container mx-auto p-8'>
        <div className='text-center'>
          <h2 className='text-4xl font-bold mb-6'>Stay Safe from Scams</h2>
          <p className='text-xl mb-8'>
            Aware AI-powered tool helps you identify potential scams in emails
            and messages.
          </p>
          <Button size='lg' asChild>
            <Link href='/detect'>Get Started</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
