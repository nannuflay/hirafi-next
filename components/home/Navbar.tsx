'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import type { Dictionary } from '@/app/[lang]/dictionaries'

type NavDict = Dictionary['nav']

const LOCALES = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'ar', label: 'AR' },
]

function LocaleSwitcher({ lang }: { lang: string }) {
  const pathname = usePathname()

  function localePath(locale: string) {
    const segments = pathname.split('/')
    segments[1] = locale
    return segments.join('/') || '/'
  }

  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-border p-0.5">
      <Globe className="mx-1.5 size-3.5 text-muted-foreground" />
      {LOCALES.map(({ code, label }) => (
        <Link
          key={code}
          href={localePath(code)}
          className={cn(
            'rounded-md px-2 py-1 text-xs font-medium transition-colors',
            code === lang
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {label}
        </Link>
      ))}
    </div>
  )
}

export function Navbar({ lang, dict }: { lang: string; dict: NavDict }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href={`/${lang}`} className="text-lg font-bold tracking-tight text-foreground">
          Hirafi
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
          <Link href={`/${lang}#how-it-works`} className="transition-colors hover:text-foreground">
            {dict.howItWorks}
          </Link>
          <Link href={`/${lang}#categories`} className="transition-colors hover:text-foreground">
            {dict.services}
          </Link>
          <Link href={`/${lang}#for-pros`} className="transition-colors hover:text-foreground">
            {dict.forPros}
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LocaleSwitcher lang={lang} />
          <Link href={`/${lang}/login`} className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}>
            {dict.signIn}
          </Link>
          <Link href={`/${lang}/signup`} className={cn(buttonVariants({ size: 'sm' }))}>
            {dict.getStarted}
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
            <Link href={`/${lang}#how-it-works`} onClick={() => setOpen(false)} className="hover:text-foreground">
              {dict.howItWorks}
            </Link>
            <Link href={`/${lang}#categories`} onClick={() => setOpen(false)} className="hover:text-foreground">
              {dict.services}
            </Link>
            <Link href={`/${lang}#for-pros`} onClick={() => setOpen(false)} className="hover:text-foreground">
              {dict.forPros}
            </Link>
          </nav>
          <div className="mt-4 flex flex-col gap-3">
            <LocaleSwitcher lang={lang} />
            <div className="flex gap-3">
              <Link href={`/${lang}/login`} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'flex-1 justify-center')}>
                {dict.signIn}
              </Link>
              <Link href={`/${lang}/signup`} className={cn(buttonVariants({ size: 'sm' }), 'flex-1 justify-center')}>
                {dict.getStarted}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
