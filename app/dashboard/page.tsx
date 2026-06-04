import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// Fallback landing that bounces to the role-appropriate dashboard.
// Reached if the middleware sends an authenticated user here without a role.
export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  redirect(profile?.role === 'vendor' ? '/dashboard/vendor' : '/dashboard/client')
}
