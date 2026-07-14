import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { getDictionary, type Locale } from '../../../dictionaries'
import { ClientBookingsTable } from '@/components/dashboard/client-bookings-table'

export default async function ClientBookingsPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) notFound()

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, profiles!bookings_vendor_id_fkey(full_name, avatar_url)')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <ClientBookingsTable
      bookings={(bookings as any) ?? []}
      lang={lang}
      dict={dict}
    />
  )
}
