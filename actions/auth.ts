'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { UserRole } from '@/types/database'

type AuthState = { error: string; success?: string; email?: string }

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
  // Redirect immediately only when confirmation is disabled.
  if (data.session) {
    redirect(role === 'vendor' ? '/dashboard/vendor' : '/dashboard/client')
  }

  return {
    error: '',
    success: 'confirmation_sent',
    email,
  }
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

  redirect(profile?.role === 'vendor' ? '/dashboard/vendor' : '/dashboard/client')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
