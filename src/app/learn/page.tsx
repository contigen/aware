import { AlertTriangle, Eye, Phone, Shield } from 'lucide-react'

const tips = [
  {
    icon: Shield,
    title: `Be Cautious with Personal Information`,
    description: `Never share sensitive details unless you’re certain of the recipient’s identity.`,
  },
  {
    icon: Eye,
    title: `Verify Sender’s Identity`,
    description: `Double-check email addresses and website URLs for authenticity.`,
  },
  {
    icon: AlertTriangle,
    title: `Be Wary of Urgency`,
    description: `Scammers often create a false sense of urgency. Take your time to verify.`,
  },
  {
    icon: Phone,
    title: `Call to Confirm`,
    description: `If in doubt, call the company directly using a number you trust, not one provided in the message.`,
  },
]

export default function Page() {
  return (
    <div className='p-4'>
      <h2 className='text-3xl font-bold mb-6'>Tips to Avoid Scams</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {tips.map((tip, idx) => (
          <section key={idx} className='flex gap-2 items-baselin'>
            <tip.icon className='text-blue-500 flex-shrink-0 mt-1' size={24} />
            <div>
              <h3 className='font-bold mb-2'>{tip.title}</h3>
              <p>{tip.description}</p>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
