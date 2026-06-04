import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Supabase redirects here after email confirmation.
// Exchanges the one-time code for a session then bounces to the dashboard.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        const destination = profile?.role === 'vendor'
          ? '/dashboard/vendor'
          : '/dashboard/client'

        return NextResponse.redirect(`${origin}${destination}`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=confirmation_failed`)
}
