import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { hasLocale } from '../dictionaries'
import { notFound } from 'next/navigation'

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/${lang}/login`)

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  redirect(
    profile?.role === 'vendor'
      ? `/${lang}/dashboard/vendor`
      : `/${lang}/dashboard/client`
  )
}
