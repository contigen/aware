'use client'

import Link from 'next/link'
import { Button } from './button'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { cn } from '&/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet'
import { Dispatch, SetStateAction, useState } from 'react'

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
  { name: `Scam Exercise`, href: `/scam-exercise` },
  {
    name: `About`,
    href: `/about`,
  },
]

function NavLinks({
  className,
  setIsMenuOpen,
}: {
  className?: string
  setIsMenuOpen?: Dispatch<SetStateAction<boolean>>
}) {
  const pathname = usePathname()
  return (
    <ul className={cn(`flex space-x-4`, className)}>
      {ROUTES.map(route => (
        <li key={route.name}>
          <Button
            variant='ghost'
            asChild
            className={cn(pathname == route.href && 'bg-white text-blue-600')}
            onClick={() => setIsMenuOpen?.(false)}
          >
            <Link href={route.href}>{route.name}</Link>
          </Button>
        </li>
      ))}
    </ul>
  )
}

const logo = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='32'
    height='32'
    viewBox='0 0 24 24'
    fill='none'
  >
    <path
      d='M20.41 6.961v1.83c0 .64-.3 1.24-.82 1.61l-11 8.06c-.71.52-1.68.52-2.38-.01l-1.44-1.08c-.65-.49-1.18-1.55-1.18-2.36v-8.05c0-1.12.86-2.36 1.91-2.75l5.47-2.05c.57-.21 1.49-.21 2.06 0l5.47 2.05c1.05.39 1.91 1.63 1.91 2.75ZM18.822 12.341c.66-.48 1.59-.01 1.59.81v1.88c0 .81-.53 1.86-1.18 2.35l-5.47 4.09c-.48.35-1.12.53-1.76.53-.64 0-1.28-.18-1.76-.54l-.83-.62a.997.997 0 0 1 .01-1.61l9.4-6.89Z'
      fill='#fff'
    ></path>
  </svg>
)

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  return (
    <header className='bg-blue-600 text-white p-4'>
      <nav className='container mx-auto flex justify-between items-center'>
        <Link href='/'>
          <span className='inline-flex items-center gap-2'>
            {logo}
            <h2 className='text-2xl font-bold'>Aware</h2>
          </span>
        </Link>
        <NavLinks className='hidden md:flex' />
        <div className='md:hidden'>
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon' className='md:hidden'>
                <Menu className='h-6 w-6' />
                <span className='sr-only'>Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='right' className='w-2/3'>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <NavLinks
                className='flex-col gap-2 mt-4 items-center'
                {...{ setIsMenuOpen }}
              />
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
