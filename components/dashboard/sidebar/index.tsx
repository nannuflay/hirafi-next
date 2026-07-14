'use client'

import { useState, useEffect } from 'react'
import { Menu, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { SidebarBody } from './sidebar-body'
import { NotificationBell } from '@/components/dashboard/notification-bell'
import type { Dictionary } from '@/app/[lang]/dictionaries'

type UserRole = 'client' | 'vendor'

export function DashboardSidebar({
  lang, role, userName, avatarUrl, dict, userId,
}: {
  lang: string; role: UserRole; userName: string; avatarUrl: string | null
  dict: Dictionary; userId: string
}) {
  const t = dict.dashboard.sidebar
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCollapsed(saved === 'true')
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('sidebar-collapsed', String(collapsed))
    }
  }, [collapsed, mounted])

  const toggle = () => setCollapsed(prev => !prev)

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={cn(
        'sticky top-0 hidden h-screen lg:flex shrink-0 flex-col border-r border-sidebar-border transition-[width] duration-300 ease-in-out z-30',
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

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-border bg-card/80 px-4 py-3 backdrop-blur-lg lg:hidden">
        <div className="flex items-center gap-3">
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
                showToggle={false}
              />
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm shadow-primary/20">
              <Zap className="size-3.5" />
            </div>
            <span className="font-bold tracking-tight">Hirafi</span>
          </div>
        </div>
        <NotificationBell
          userId={userId}
          role={role}
          lang={lang}
          dict={dict}
        />
      </div>
    </>
  )
}
