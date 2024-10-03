import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import './globals.css'
import { Toaster } from '&/components/ui/toaster'
import { Navbar } from '&/components/ui/navbar'
import { Button } from '&/components/ui/button'

export const metadata: Metadata = {
  title: 'Aware',
  description: 'A web app that analyses text to detect scams in text messages',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${GeistSans.className} antialiased`}>
        <div className='min-h-dvh flex flex-col'>
          <Navbar />
          <section className='flex-grow'>{children}</section>
          <footer className='p-4 bg-blue-600 text-white'>
            <div className='container mx-auto flex justify-between items-center'>
              <p>&copy; {new Date().getFullYear()} Aware</p>
              <ul className='flex space-x-4'>
                <li>
                  <Button variant='link'>Privacy Policy</Button>
                </li>
                <li>
                  <Button variant='link'>Terms of Service</Button>
                </li>
                <li>
                  <Button variant='link'>Contact Support</Button>
                </li>
              </ul>
            </div>
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  )
}
