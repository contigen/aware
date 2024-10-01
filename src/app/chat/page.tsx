import { ChatUI } from './chat-ui'

export default function Page() {
  return (
    <div className='p-4'>
      <h2>Diagnosis Session.</h2>
      <div className='mt-4'>
        <ChatUI />
      </div>
    </div>
  )
}
