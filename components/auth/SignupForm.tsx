'use client'

import { useActionState } from 'react'
import { signUp } from '@/actions/auth'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { Dictionary } from '@/app/[lang]/dictionaries'

type SignupDict = Dictionary['auth']['signup']

const initialState = { error: '', success: '', email: '' }

export function SignupForm({ lang, dict }: { lang: string; dict: SignupDict }) {
  const [state, formAction, pending] = useActionState(signUp, initialState)

  if (state.success) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-10 pb-8 px-8">
          <div className="flex flex-col items-center text-center gap-5">
            <div className="rounded-2xl bg-primary/10 p-5">
              <svg
                className="size-10 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold tracking-tight">{dict.confirmationTitle}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {dict.confirmationText}{' '}
                <span className="font-semibold text-foreground">{state.email}</span>.
                <br />
                {dict.confirmationAction}
              </p>
            </div>

            <div className="w-full rounded-xl border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
              {dict.spamHint}
            </div>
          </div>
        </CardContent>

        <CardFooter className="justify-center text-sm text-muted-foreground pb-8">
          {dict.wrongEmail}&nbsp;
          <button
            onClick={() => window.location.reload()}
            className="text-foreground font-medium underline underline-offset-4"
          >
            {dict.signUpAgain}
          </button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">{dict.title}</CardTitle>
        <CardDescription>{dict.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">{dict.fullName}</Label>
            <Input
              id="full_name"
              name="full_name"
              type="text"
              placeholder={dict.fullNamePlaceholder}
              required
              autoComplete="name"
            />
          </div>

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
              autoComplete="new-password"
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label>{dict.roleLabel}</Label>
            <div className="grid grid-cols-2 gap-3">
              <RoleOption value="client" label={dict.roleClient} description={dict.roleClientDesc} />
              <RoleOption value="vendor" label={dict.roleVendor} description={dict.roleVendorDesc} />
            </div>
          </div>

          {state.error && (
            <p className="text-sm text-destructive" aria-live="polite">
              {state.error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? dict.submitting : dict.submit}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        {dict.hasAccount}&nbsp;
        <Link
          href={`/${lang}/login`}
          className="text-foreground font-medium underline underline-offset-4"
        >
          {dict.signIn}
        </Link>
      </CardFooter>
    </Card>
  )
}

function RoleOption({
  value,
  label,
  description,
}: {
  value: string
  label: string
  description: string
}) {
  return (
    <label className="flex flex-col items-center gap-1 rounded-lg border p-3 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-colors">
      <input type="radio" name="role" value={value} className="sr-only" required />
      <span className="font-medium text-sm">{label}</span>
      <span className="text-xs text-muted-foreground text-center">{description}</span>
    </label>
  )
}
