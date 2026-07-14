'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { UserRole } from '@/types/database'

type AuthState = { error: string; success?: string; email?: string; redirect?: string }

export async function signUp(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string
  const role = formData.get('role') as UserRole

  if (!email || !password || !fullName || !role) {
    return { error: 'All fields are required.' }
  }

  if (!['client', 'vendor'].includes(role)) {
    return { error: 'Invalid role selected.' }
  }

  const supabase = await createClient()

  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Passed to raw_user_meta_data — the DB trigger reads these to create the profile row.
      data: { role, full_name: fullName },
    },
  })

  if (signUpError) return { error: signUpError.message }
  if (!data.user) return { error: 'Signup failed. Please try again.' }

  // data.session is null when Supabase requires email confirmation.
  // Return redirect path for client-side navigation (avoids throwing inside transitions).
  if (data.session) {
    return { error: '', redirect: role === 'vendor' ? '/dashboard/vendor' : '/dashboard/client' }
  }

  return {
    error: '',
    success: 'confirmation_sent',
    email,
  }
}

export async function signUpFull(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email    = (formData.get('email')    as string)?.trim()
  const password =  formData.get('password') as string
  const fullName = (formData.get('full_name') as string)?.trim()
  const phone    = (formData.get('phone')    as string)?.trim()
  const role     =  formData.get('role')     as UserRole
  const lang     = (formData.get('lang')     as string) || 'en'

  // Vendor-specific fields (all optional in the action — trigger defaults gracefully)
  const category = (formData.get('category') as string)?.trim() || ''
  const bio      = (formData.get('bio')      as string)?.trim() || ''
  const rate     = (formData.get('rate')     as string)?.trim() || ''
  const city     = (formData.get('city')     as string)?.trim() || ''
  const avatar   =  formData.get('avatar')   as File | null

  if (!email || !password || !fullName || !phone || !role) {
    return { error: 'All required fields must be filled.' }
  }
  if (!['client', 'vendor'].includes(role)) {
    return { error: 'Invalid role selected.' }
  }
  if (role === 'vendor' && !category) {
    return { error: 'Please select a service category.' }
  }

  const supabase = await createClient()

  const metadata: Record<string, string> = { role, full_name: fullName, phone }
  if (city)     metadata.city     = city
  if (category) metadata.category = category
  if (bio)      metadata.bio      = bio
  if (rate)     metadata.rate     = rate

  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: metadata },
  })

  if (signUpError) return { error: signUpError.message }
  if (!data.user)  return { error: 'Signup failed. Please try again.' }

  // Upload avatar via service role (non-critical — silently skipped if unavailable)
  if (avatar && avatar.size > 0 && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const admin = createAdminClient()
      const ext  = (avatar.name.split('.').pop() ?? 'jpg').toLowerCase()
      const path = `${data.user.id}/avatar.${ext}`

      const { error: uploadErr } = await admin.storage
        .from('avatars')
        .upload(path, avatar, { contentType: avatar.type, upsert: true })

      if (!uploadErr) {
        const { data: { publicUrl } } = admin.storage.from('avatars').getPublicUrl(path)
        await admin.from('profiles').update({ avatar_url: publicUrl }).eq('id', data.user.id)
      }
    } catch {
      // Avatar upload is best-effort
    }
  }

  if (data.session) {
    return { error: '', redirect: `/${lang}/dashboard/${role === 'vendor' ? 'vendor' : 'client'}` }
  }

  return { error: '', success: 'confirmation_sent', email }
}

export async function signIn(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  const supabase = await createClient()

  const { data, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (signInError) return { error: signInError.message }
  if (!data.user) return { error: 'Sign in failed. Please try again.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  return { error: '', redirect: profile?.role === 'vendor' ? '/dashboard/vendor' : '/dashboard/client' }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
