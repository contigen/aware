import { AlertTriangle, Eye, Phone, Shield } from 'lucide-react'

export default function Page() {
  return (
    <div className='p-4'>
      <h2 className='text-3xl font-bold mb-6'>Tips to Avoid Scams</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='flex items-start'>
          <Shield className='text-blue-500 mr-4' size={24} />
          <div>
            <h3 className='font-bold mb-2'>
              Be Cautious with Personal Information
            </h3>
            <p>
              Never share sensitive details unless you’re certain of the
              recipient’s identity.
            </p>
          </div>
        </div>
        <div className='flex items-start'>
          <Eye className='text-blue-500 mr-4' size={24} />
          <div>
            <h3 className='font-bold mb-2'>Verify Sender's Identity</h3>
            <p>
              Double-check email addresses and website URLs for authenticity.
            </p>
          </div>
        </div>
        <div className='flex items-start'>
          <AlertTriangle className='text-blue-500 mr-4' size={24} />
          <div>
            <h3 className='font-bold mb-2'>Be Wary of Urgency</h3>
            <p>
              Scammers often create a false sense of urgency. Take your time to
              verify.
            </p>
          </div>
        </div>
        <div className='flex items-start'>
          <Phone className='text-blue-500 mr-4' size={24} />
          <div>
            <h3 className='font-bold mb-2'>Call to Confirm</h3>
            <p>
              If in doubt, call the company directly using a number you trust,
              not one provided in the message.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
