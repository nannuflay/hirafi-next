'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'
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

function SubmitButton({ dict }: { dict: SignupDict }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? dict.submitting : dict.submit}
    </Button>
  )
}

export function SignupForm({ lang, dict }: { lang: string; dict: SignupDict }) {
  const [state, formAction] = useActionState(signUp, initialState)
  const router = useRouter()

  if (state.redirect) {
    router.push(state.redirect)
  }

  if (state.success) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-10 pb-8 px-8">
          <div className="flex flex-col items-center text-center gap-5">
            <div className="rounded-2xl bg-primary/10 p-5">
              <Mail className="size-10 text-primary" />
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
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 font-medium text-foreground underline underline-offset-4"
            onClick={() => window.location.reload()}
          >
            {dict.signUpAgain}
          </Button>
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

          <SubmitButton dict={dict} />
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
    <label className="flex flex-col items-center gap-1 rounded-lg border border-border bg-background p-3 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-colors">
      <input type="radio" name="role" value={value} className="sr-only" required />
      <span className="font-medium text-sm text-foreground">{label}</span>
      <span className="text-xs text-muted-foreground text-center">{description}</span>
    </label>
  )
}
