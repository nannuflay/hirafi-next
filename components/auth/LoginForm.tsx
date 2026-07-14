'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useFormStatus } from 'react-dom'
import { signIn } from '@/actions/auth'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import type { Dictionary } from '@/app/[lang]/dictionaries'

type LoginDict = Dictionary['auth']['login']

const initialState = { error: '', redirect: '' }

function SubmitButton({ dict }: { dict: LoginDict }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? dict.submitting : dict.submit}
    </Button>
  )
}

export function LoginForm({ dict }: { dict: LoginDict }) {
  const [state, formAction] = useActionState(signIn, initialState)
  const router = useRouter()

  useEffect(() => {
    if (state.redirect) {
      router.push(state.redirect)
    }
  }, [state.redirect, router])

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{dict.email}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{dict.password}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />
      </div>

      {state.error && (
        <p className="text-sm text-destructive" aria-live="polite">
          {state.error}
        </p>
      )}

      <SubmitButton dict={dict} />
    </form>
  )
}
