import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import './globals.css'
import { Toaster } from '&/components/ui/toaster'
import { Navbar } from '&/components/ui/navbar'
import { Footer } from '&/components/ui/footer'

export const metadata: Metadata = {
  title: `Aware | AI-Powered Scam Detection Web app for Seniors`,
  description: `A web app that analyses text to detect scams in text messages`,
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
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  )
}
