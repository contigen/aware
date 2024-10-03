'use client'

import Link from 'next/link'
import { Button } from './button'
import { usePathname } from 'next/navigation'
import { Shield } from 'lucide-react'
import { cn } from '&/lib/utils'

const ROUTES = [
  {
    name: `Home`,
    href: `/`,
  },
  {
    name: `Detect`,
    href: `/detect`,
  },
  {
    name: `Learn`,
    href: '/learn',
  },
  {
    name: `About`,
    href: `/about`,
  },
]

export function Navbar() {
  const pathname = usePathname()
  return (
    <header className='bg-blue-600 text-white p-4'>
      <nav className='container mx-auto flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <Shield className='w-8 h-8' />
          <h2 className='text-2xl font-bold'>Aware</h2>
        </div>
        <ul className='flex space-x-4'>
          {ROUTES.map(route => (
            <li key={route.name}>
              <Button
                variant='ghost'
                asChild
                className={cn(
                  pathname === route.href && 'bg-white text-blue-600'
                )}
              >
                <Link href={route.href}>{route.name}</Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
