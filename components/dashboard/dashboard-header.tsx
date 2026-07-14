'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { User, LogOut, Home } from 'lucide-react'
import { signOut } from '@/actions/auth'
import { cn } from '@/lib/utils'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuGroup,
} from '@/components/ui/dropdown-menu'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { NotificationBell } from '@/components/dashboard/notification-bell'
import type { Dictionary } from '@/app/[lang]/dictionaries'

type UserRole = 'client' | 'vendor'

const LOCALES = [
  { code: 'en', label: 'EN', native: 'English', flag: 'gb' },
  { code: 'fr', label: 'FR', native: 'Français', flag: 'fr' },
  { code: 'ar', label: 'AR', native: 'العربية', flag: 'tn' },
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
  const currentLocale = LOCALES.find((l) => l.code === lang)

  function localePath(locale: string) {
    const segments = pathname.split('/')
    segments[1] = locale
    return segments.join('/') || '/'
  }

  return (
    <Select
      value={lang}
      onValueChange={(value) => {
        if (value) window.location.href = localePath(value)
      }}
    >
      <SelectTrigger className="h-9 gap-2 rounded-full border-0 bg-muted/50 px-3 text-xs font-medium transition-colors hover:bg-muted [&>span]:flex [&>span]:items-center [&>span]:gap-2">
        <FlagIcon code={currentLocale?.flag ?? 'gb'} size={16} />
        <SelectValue>{currentLocale?.label}</SelectValue>
      </SelectTrigger>
      <SelectContent className="min-w-[160px]">
        {LOCALES.map(({ code, label, native, flag }) => (
          <SelectItem key={code} value={code} className="text-sm">
            <span className="flex items-center gap-2.5">
              <FlagIcon code={flag} size={16} />
              <span className="font-medium">{native}</span>
              <span className="ms-auto text-xs text-muted-foreground">{label}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function DashboardHeader({
  lang,
  role,
  userName,
  avatarUrl,
  dict,
  userId,
}: {
  lang: string
  role: UserRole
  userName: string
  avatarUrl: string | null
  dict: Dictionary
  userId: string
}) {
  const t = dict.dashboard.sidebar
  const initials = userName
    .split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <header className="hidden lg:flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-6">
      <div />
      <div className="flex items-center gap-2">
        <LocaleSwitcher lang={lang} />
        <NotificationBell
          userId={userId}
          role={role}
          lang={lang}
          dict={dict}
        />
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button className="flex items-center gap-2.5 rounded-xl py-1.5 ps-1.5 pe-3 outline-none transition-colors duration-200 hover:bg-muted" />
            }
          >
            <Avatar className="size-8 shrink-0 border-2 border-primary/20">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={userName} />}
              <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden xl:block text-start min-w-0">
              <p className="truncate text-sm font-medium leading-tight">{userName}</p>
              <p className="truncate text-xs text-muted-foreground capitalize">{role}</p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" sideOffset={8} align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <p className="font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground capitalize">{role}</p>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href={`/${lang}`} />}>
              <Home className="size-4" />
              {t.home}
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href={`/${lang}/dashboard/${role}/profile`} />}>
              <User className="size-4" />
              {t.profile}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" render={<form action={signOut} className="w-full" />}>
              <button type="submit" className="flex w-full items-center gap-2.5 text-sm font-medium">
                <LogOut className="size-4" />
                {t.signOut}
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
