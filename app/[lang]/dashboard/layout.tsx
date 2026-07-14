import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { hasLocale, getDictionary, type Locale } from '../dictionaries'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'

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
  const userName = profile?.full_name ?? user.email ?? ''

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar
        lang={lang}
        role={role}
        userName={userName}
        avatarUrl={profile?.avatar_url ?? null}
        dict={dict}
        userId={user.id}
      />
      <div className="flex flex-1 flex-col overflow-auto pt-14 lg:pt-0">
        <DashboardHeader
          lang={lang}
          role={role}
          userName={userName}
          avatarUrl={profile?.avatar_url ?? null}
          dict={dict}
          userId={user.id}
        />
        <main className="flex-1">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
