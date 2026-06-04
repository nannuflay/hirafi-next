'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-lg font-bold tracking-tight text-foreground">
          Hirafi
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
          <Link href="#how-it-works" className="transition-colors hover:text-foreground">
            How it works
          </Link>
          <Link href="#categories" className="transition-colors hover:text-foreground">
            Services
          </Link>
          <Link href="#for-pros" className="transition-colors hover:text-foreground">
            For professionals
          </Link>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className={cn(buttonVariants({ size: 'sm' }))}
          >
            Get started
          </Link>
        </div>

        <button
          className="rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-b border-border bg-background px-4 pb-5 pt-2 md:hidden">
          <nav className="flex flex-col gap-4 text-sm font-medium text-muted-foreground">
            <Link href="#how-it-works" onClick={() => setOpen(false)} className="hover:text-foreground">
              How it works
            </Link>
            <Link href="#categories" onClick={() => setOpen(false)} className="hover:text-foreground">
              Services
            </Link>
            <Link href="#for-pros" onClick={() => setOpen(false)} className="hover:text-foreground">
              For professionals
            </Link>
          </nav>
          <div className="mt-4 flex gap-3">
            <Link href="/login" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'flex-1 justify-center')}>
              Sign in
            </Link>
            <Link href="/signup" className={cn(buttonVariants({ size: 'sm' }), 'flex-1 justify-center')}>
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
