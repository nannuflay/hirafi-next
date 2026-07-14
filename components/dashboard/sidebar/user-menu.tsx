'use client'

import Link from 'next/link'
import { signOut } from '@/actions/auth'
import { User, LogOut } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import type { Dictionary } from '@/app/[lang]/dictionaries'

type UserRole = 'client' | 'vendor'

function UserAvatar({
  userName, avatarUrl, size = 9,
}: {
  userName: string; avatarUrl: string | null; size?: number
}) {
  const initials = userName
    .split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <Avatar className={`size-${size} shrink-0 border-2 border-primary/20`}>
      {avatarUrl && <AvatarImage src={avatarUrl} alt={userName} />}
      <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}

function DropdownItems({
  lang, role, userName, t,
}: {
  lang: string; role: UserRole; userName: string
  t: Dictionary['dashboard']['sidebar']
}) {
  return (
    <>
      <DropdownMenuLabel>
        <p className="font-medium">{userName}</p>
        <p className="text-xs text-muted-foreground capitalize">{role}</p>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
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
    </>
  )
}

export function UserMenu({
  lang, role, userName, avatarUrl, t, collapsed,
}: {
  lang: string; role: UserRole; userName: string; avatarUrl: string | null
  t: Dictionary['dashboard']['sidebar']; collapsed: boolean
}) {
  if (collapsed) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button className="mx-auto flex size-9 shrink-0 items-center justify-center rounded-xl outline-none transition-shadow duration-200 hover:ring-2 hover:ring-primary/20" />
          }
        >
          <UserAvatar userName={userName} avatarUrl={avatarUrl} />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" sideOffset={12} align="start" className="w-56">
          <DropdownItems lang={lang} role={role} userName={userName} t={t} />
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className="flex w-full items-center gap-3 rounded-xl px-2 py-2 outline-none transition-colors duration-200 hover:bg-sidebar-accent" />
        }
      >
        <UserAvatar userName={userName} avatarUrl={avatarUrl} />
        <div className="flex-1 text-left min-w-0">
          <p className="truncate text-sm font-medium text-sidebar-foreground">{userName}</p>
          <p className="truncate text-xs text-muted-foreground capitalize">{role}</p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" sideOffset={8} align="start" className="w-56">
        <DropdownItems lang={lang} role={role} userName={userName} t={t} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
