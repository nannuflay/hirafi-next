'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Dictionary } from '@/app/[lang]/dictionaries'

type NavDict = Dictionary['nav']

const LOCALES = [
  { code: 'en', label: 'EN', name: 'English', native: 'English', flag: 'gb' },
  { code: 'fr', label: 'FR', name: 'French', native: 'Français', flag: 'fr' },
  { code: 'ar', label: 'AR', name: 'Arabic', native: 'العربية', flag: 'tn' },
]

function FlagIcon({ code, size = 16 }: { code: string; size?: number }) {
  return (
    <Image
      src={`https://flagcdn.com/${code}.svg`}
      alt=""
      width={size}
      height={size}
      unoptimized
      className="rounded-sm object-cover"
    />
  )
}

function LocaleSwitcher({ lang }: { lang: string }) {
  const pathname = usePathname()

  function localePath(locale: string) {
    const segments = pathname.split('/')
    segments[1] = locale
    return segments.join('/') || '/'
  }

  const currentLocale = LOCALES.find((l) => l.code === lang)

  return (
    <Select
      value={lang}
      onValueChange={(value) => {
        if (value) window.location.href = localePath(value)
      }}
    >
      <SelectTrigger className="!h-10 gap-2 rounded-full border-0 bg-muted/50 px-3.5 text-xs font-medium backdrop-blur-sm transition-colors hover:bg-muted [&>span]:flex [&>span]:items-center [&>span]:gap-2">
        <FlagIcon code={currentLocale?.flag ?? 'gb'} size={18} />
        <SelectValue>{currentLocale?.label}</SelectValue>
      </SelectTrigger>
      <SelectContent className="min-w-[160px]">
        {LOCALES.map(({ code, label, native, flag }) => (
          <SelectItem key={code} value={code} className="text-sm">
            <span className="flex items-center gap-2.5">
              <FlagIcon code={flag} size={18} />
              <span className="font-medium">{native}</span>
              <span className="ml-auto text-xs text-muted-foreground">{label}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function Navbar({ lang, dict, userRole }: { lang: string; dict: NavDict; userRole: string | null }) {
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
          {userRole ? (
            <>
              <Link href={`/${lang}/dashboard/${userRole}`} className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}>
                {dict.dashboard}
              </Link>
            </>
          ) : (
            <>
              <Link href={`/${lang}/login`} className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}>
                {dict.signIn}
              </Link>
              <Link href={`/${lang}/signup`} className={cn(buttonVariants({ size: 'sm' }))}>
                {dict.getStarted}
              </Link>
            </>
          )}
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
            {userRole ? (
              <Link href={`/${lang}/dashboard/${userRole}`} className={cn(buttonVariants({ size: 'sm' }), 'flex-1 justify-center')}>
                {dict.dashboard}
              </Link>
            ) : (
              <div className="flex gap-3">
                <Link href={`/${lang}/login`} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'flex-1 justify-center')}>
                  {dict.signIn}
                </Link>
                <Link href={`/${lang}/signup`} className={cn(buttonVariants({ size: 'sm' }), 'flex-1 justify-center')}>
                  {dict.getStarted}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
