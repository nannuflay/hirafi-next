import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { hasLocale, getDictionary, type Locale } from '../dictionaries'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { NotificationBell } from '@/components/dashboard/notification-bell'

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${lang}/login`)

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, avatar_url, city, phone')
    .eq('id', user.id)
    .single()

  const dict = await getDictionary(lang as Locale)
  const role = profile?.role ?? 'client'

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar
        lang={lang}
        role={role}
        userName={profile?.full_name ?? user.email ?? ''}
        avatarUrl={profile?.avatar_url ?? null}
        dict={dict}
      />
      <main className="flex-1 overflow-auto pt-14 lg:pt-0">
        <header className="sticky top-0 z-30 flex items-center justify-end border-b border-border bg-background/80 px-4 py-2 backdrop-blur-sm lg:px-8">
          <NotificationBell
            userId={user.id}
            role={role}
            lang={lang}
            dict={dict}
          />
        </header>
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
