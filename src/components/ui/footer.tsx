import { Button } from './button'

export function Footer() {
  return (
    <footer className='p-4 bg-blue-600 text-white'>
      <div className='container mx-auto flex justify-between items-center flex-col md:flex-row'>
        <p>&copy; {new Date().getFullYear()} Aware</p>
        <ul className='flex gap-2 flex-col md:flex-row'>
          {['Privacy Policy', 'Terms of Service', 'Contact Support'].map(
            link => (
              <Button variant='link' key={link}>
                {link}
              </Button>
            )
          )}
        </ul>
      </div>
    </footer>
  )
}
