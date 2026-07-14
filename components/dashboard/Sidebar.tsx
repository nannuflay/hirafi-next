'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/actions/auth'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard, CalendarDays, CalendarClock,
  User, LogOut, Zap, Menu,
} from 'lucide-react'
import { SidebarCollapseIcon } from '@/components/icons/SidebarCollapseIcon'
import { cn } from '@/lib/utils'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Tooltip, TooltipTrigger, TooltipContent, TooltipProvider,
} from '@/components/ui/tooltip'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import type { Dictionary } from '@/app/[lang]/dictionaries'

type UserRole = 'client' | 'vendor'

const VENDOR_NAV = [
  { key: 'overview',     icon: LayoutDashboard, hrefSuffix: '' },
  { key: 'bookings',     icon: CalendarDays,    hrefSuffix: '/bookings' },
  { key: 'availability', icon: CalendarClock,   hrefSuffix: '/availability' },
  { key: 'profile',      icon: User,            hrefSuffix: '/profile' },
] as const

const CLIENT_NAV = [
  { key: 'overview', icon: LayoutDashboard, hrefSuffix: '' },
  { key: 'bookings', icon: CalendarDays,    hrefSuffix: '/bookings' },
  { key: 'profile',  icon: User,            hrefSuffix: '/profile' },
] as const

function NavItem({
  href, icon: Icon, label, isActive, collapsed,
}: {
  href: string; icon: React.ComponentType<{ className?: string }>; label: string
  isActive: boolean; collapsed: boolean
}) {
  const link = (
    <Link
      href={href}
      className={cn(
        'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
        isActive
          ? 'bg-primary/10 text-primary shadow-sm shadow-primary/5'
          : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground',
      )}
    >
      <Icon className={cn(
        'size-[18px] shrink-0 transition-transform duration-200',
        isActive && 'text-primary',
        !collapsed && 'group-hover:scale-105',
      )} />
      <span className={cn(
        'whitespace-nowrap transition-all duration-200',
        collapsed ? 'w-0 overflow-hidden opacity-0' : 'opacity-100',
      )}>
        {label}
      </span>
    </Link>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger render={link}>
          <span className="sr-only">{label}</span>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={12}>
          {label}
        </TooltipContent>
      </Tooltip>
    )
  }

  return link
}

function SidebarBody({
  lang, role, userName, avatarUrl, t, collapsed, onToggle,
}: {
  lang: string; role: UserRole; userName: string; avatarUrl: string | null
  t: Dictionary['dashboard']['sidebar']; collapsed: boolean; onToggle: () => void
}) {
  const pathname = usePathname()
  const items = role === 'vendor' ? VENDOR_NAV : CLIENT_NAV
  const basePath = `/${lang}/dashboard/${role}`

  const initials = userName
    .split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <TooltipProvider>
      <div className={cn(
        'flex h-full flex-col bg-sidebar transition-[width] duration-300 ease-in-out',
        collapsed ? 'w-[68px]' : 'w-[260px]',
      )}>
        {/* ── Brand ─────────────────────────────────────────── */}
        <div className={cn(
          'group/brand relative flex items-center px-4 py-4',
          collapsed ? 'justify-center px-2' : 'justify-between',
        )}>
          <div className={cn(
            'flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-all duration-200',
            collapsed ? 'group-hover/brand:opacity-0 group-hover/brand:scale-75' : 'hover:shadow-lg hover:shadow-primary/30',
          )}>
            <Zap className="size-[16px]" />
          </div>
          {!collapsed && (
            <span className="flex-1 text-lg font-bold tracking-tight text-sidebar-foreground ml-1">
              Hirafi
            </span>
          )}
          {collapsed ? (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-200 group-hover/brand:opacity-100">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      className="flex size-9 items-center justify-center rounded-xl bg-muted/80 text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
                      onClick={onToggle}
                    />
                  }
                >
                  <SidebarCollapseIcon className="size-4" />
                  <span className="sr-only">Open sidebar</span>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={12}>
                  Open sidebar
                </TooltipContent>
              </Tooltip>
            </div>
          ) : (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="shrink-0 text-muted-foreground hover:text-foreground transition-colors duration-200"
                    onClick={onToggle}
                  />
                }
              >
                <SidebarCollapseIcon className="size-4" />
                <span className="sr-only">Close sidebar</span>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={8}>
                Close sidebar
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* ── Navigation ────────────────────────────────────── */}
        <nav className="flex-1 space-y-1 overflow-hidden px-3 py-4">
          {items.map(({ key, icon, hrefSuffix }) => {
            const href = `${basePath}${hrefSuffix}`
            const isActive = hrefSuffix === ''
              ? pathname === href
              : pathname.startsWith(href)

            return (
              <NavItem
                key={key}
                href={href}
                icon={icon}
                label={t[key as keyof typeof t]}
                isActive={isActive}
                collapsed={collapsed}
              />
            )
          })}
        </nav>

        {/* ── User section ──────────────────────────────────── */}
        <div className={cn(
          'border-t border-sidebar-border p-3',
          collapsed && 'px-2',
        )}>
          {collapsed ? (
            /* Collapsed: avatar triggers dropdown */
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="mx-auto flex size-9 shrink-0 items-center justify-center rounded-xl outline-none transition-shadow duration-200 hover:ring-2 hover:ring-primary/20" />
                }
              >
                <Avatar className="size-9 border-2 border-primary/20">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt={userName} />}
                  <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" sideOffset={12} align="start" className="w-56">
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
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /* Expanded: full user row with dropdown */
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="flex w-full items-center gap-3 rounded-xl px-2 py-2 outline-none transition-colors duration-200 hover:bg-sidebar-accent" />
                }
              >
                <Avatar className="size-9 shrink-0 border-2 border-primary/20">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt={userName} />}
                  <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <p className="truncate text-sm font-medium text-sidebar-foreground">{userName}</p>
                  <p className="truncate text-xs text-muted-foreground capitalize">{role}</p>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" sideOffset={8} align="start" className="w-56">
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
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}

export function DashboardSidebar({
  lang, role, userName, avatarUrl, dict,
}: {
  lang: string; role: UserRole; userName: string; avatarUrl: string | null
  dict: Dictionary
}) {
  const t = dict.dashboard.sidebar
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Hydrate from localStorage after client mount
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCollapsed(saved === 'true')
    setMounted(true)
  }, [])

  // Persist to localStorage on change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('sidebar-collapsed', String(collapsed))
    }
  }, [collapsed, mounted])

  const toggle = () => setCollapsed(prev => !prev)

  return (
    <>
      {/* ── Desktop sidebar ──────────────────────────────────── */}
      <aside className={cn(
        'hidden lg:flex shrink-0 flex-col border-r border-sidebar-border transition-[width] duration-300 ease-in-out',
        mounted && collapsed ? 'w-[68px]' : 'w-[260px]',
      )}>
        <SidebarBody
          lang={lang}
          role={role}
          userName={userName}
          avatarUrl={avatarUrl}
          t={t}
          collapsed={mounted && collapsed}
          onToggle={toggle}
        />
      </aside>

      {/* ── Mobile top bar ───────────────────────────────────── */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center gap-3 border-b border-border bg-card/80 px-4 py-3 backdrop-blur-lg lg:hidden">
        <Sheet>
          <SheetTrigger
            render={<Button variant="ghost" size="icon" className="size-9" />}
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SidebarBody
              lang={lang}
              role={role}
              userName={userName}
              avatarUrl={avatarUrl}
              t={t}
              collapsed={false}
              onToggle={() => {}}
            />
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Zap className="size-3.5" />
          </div>
          <span className="font-bold">Hirafi</span>
        </div>
      </div>

      {/* Spacer for mobile top bar */}
      <div className="h-14 lg:hidden" />
    </>
  )
}
