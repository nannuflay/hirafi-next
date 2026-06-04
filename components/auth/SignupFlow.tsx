'use client'

import { useTransition, useState, useRef } from 'react'
import Link from 'next/link'
import {
  User, Phone, Mail, Lock, ArrowRight, ArrowLeft,
  Wrench, Zap, Settings2, Truck, Hammer, Paintbrush,
  Sparkles, LayoutGrid, Camera, Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { signUpFull } from '@/actions/auth'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { buttonVariants } from '@/components/ui/button'
import type { Dictionary } from '@/app/[lang]/dictionaries'

// ── Types ────────────────────────────────────────────────────────────────────

type Step     = 'basics' | 'role' | 'category' | 'profile'
type RoleVal  = 'client' | 'vendor' | ''

interface FlowData {
  fullName: string; phone: string; email: string; password: string
  role: RoleVal; category: string
  city: string; bio: string; rate: string
  avatarFile: File | null; avatarPreview: string | null
}

const INITIAL: FlowData = {
  fullName: '', phone: '', email: '', password: '',
  role: '', category: '',
  city: '', bio: '', rate: '',
  avatarFile: null, avatarPreview: null,
}

const CLIENT_STEPS: Step[] = ['basics', 'role']
const VENDOR_STEPS: Step[] = ['basics', 'role', 'category', 'profile']

// ── Category data ─────────────────────────────────────────────────────────────

const CATEGORIES = [
  { key: 'plumbing',        icon: Wrench,     color: 'bg-blue-100 text-blue-600' },
  { key: 'electricity',     icon: Zap,        color: 'bg-yellow-100 text-yellow-600' },
  { key: 'appliance_repair', icon: Settings2,  color: 'bg-purple-100 text-purple-600' },
  { key: 'transport',       icon: Truck,      color: 'bg-green-100 text-green-600' },
  { key: 'carpentry',       icon: Hammer,     color: 'bg-orange-100 text-orange-600' },
  { key: 'painting',        icon: Paintbrush, color: 'bg-pink-100 text-pink-600' },
  { key: 'cleaning',        icon: Sparkles,   color: 'bg-teal-100 text-teal-600' },
  { key: 'other',           icon: LayoutGrid, color: 'bg-gray-100 text-gray-500' },
] as const

// ── Progress indicator ───────────────────────────────────────────────────────

function Progress({
  steps, current, titles,
}: {
  steps: Step[]; current: number; titles: string[]
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-0">
        {steps.map((_, i) => (
          <div key={i} className="flex flex-1 items-center">
            <div
              className={cn(
                'flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-all',
                i < current  ? 'bg-primary text-primary-foreground' :
                i === current ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' :
                                'bg-muted text-muted-foreground'
              )}
            >
              {i < current ? <Check className="size-3.5" /> : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className={cn('h-px flex-1 transition-all', i < current ? 'bg-primary' : 'bg-border')} />
            )}
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs font-medium text-primary">
        {titles[current]}
      </p>
    </div>
  )
}

// ── Step 1: Basic info ────────────────────────────────────────────────────────

function StepBasics({
  data, setData, dict, errors,
}: {
  data: FlowData
  setData: (d: FlowData) => void
  dict: Dictionary['auth']['signup']
  errors: Record<string, string>
}) {
  const set = (k: keyof FlowData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setData({ ...data, [k]: e.target.value })

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="fullName" className="flex items-center gap-1.5">
          <User className="size-3.5 text-muted-foreground" /> {dict.fullName}
        </Label>
        <Input
          id="fullName" value={data.fullName} onChange={set('fullName')}
          placeholder={dict.fullNamePlaceholder} autoComplete="name"
          className={errors.fullName ? 'border-destructive' : ''}
        />
        {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone" className="flex items-center gap-1.5">
          <Phone className="size-3.5 text-muted-foreground" /> {dict.phone}
        </Label>
        <Input
          id="phone" type="tel" value={data.phone} onChange={set('phone')}
          placeholder={dict.phonePlaceholder} autoComplete="tel"
          className={errors.phone ? 'border-destructive' : ''}
        />
        {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email" className="flex items-center gap-1.5">
          <Mail className="size-3.5 text-muted-foreground" /> {dict.email}
        </Label>
        <Input
          id="email" type="email" value={data.email} onChange={set('email')}
          placeholder="you@example.com" autoComplete="email"
          className={errors.email ? 'border-destructive' : ''}
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password" className="flex items-center gap-1.5">
          <Lock className="size-3.5 text-muted-foreground" /> {dict.password}
        </Label>
        <Input
          id="password" type="password" value={data.password} onChange={set('password')}
          placeholder="••••••••" autoComplete="new-password" minLength={6}
          className={errors.password ? 'border-destructive' : ''}
        />
        {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
      </div>
    </div>
  )
}

// ── Step 2: Role ──────────────────────────────────────────────────────────────

function StepRole({
  dict, onSelect,
}: {
  dict: Dictionary['auth']['signup']
  onSelect: (role: 'client' | 'vendor') => void
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{dict.roleQuestion}</p>
      <div className="grid grid-cols-2 gap-3">
        {(
          [
            { role: 'client' as const, title: dict.clientCardTitle, desc: dict.clientCardDesc, icon: '🏠' },
            { role: 'vendor' as const, title: dict.vendorCardTitle, desc: dict.vendorCardDesc, icon: '🔧' },
          ] as const
        ).map(({ role, title, desc, icon }) => (
          <button
            key={role}
            type="button"
            onClick={() => onSelect(role)}
            className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-border bg-background p-6 text-center transition-all hover:border-primary hover:bg-primary/5 active:scale-[0.98]"
          >
            <span className="text-3xl">{icon}</span>
            <div>
              <p className="font-semibold text-foreground">{title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Step 3: Category ──────────────────────────────────────────────────────────

function StepCategory({
  data, setData, dict, catDict, errors,
}: {
  data: FlowData
  setData: (d: FlowData) => void
  dict: Dictionary['auth']['signup']
  catDict: Dictionary['categories']['items']
  errors: Record<string, string>
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">{dict.categorySubtitle}</p>
      {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
      <div className="grid grid-cols-2 gap-2.5">
        {CATEGORIES.map(({ key, icon: Icon, color }) => {
          const item = catDict[key as keyof typeof catDict]
          const selected = data.category === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => setData({ ...data, category: key })}
              className={cn(
                'flex items-center gap-2.5 rounded-xl border-2 p-3 text-start transition-all',
                selected
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-background hover:border-primary/40'
              )}
            >
              <div className={cn('flex size-8 shrink-0 items-center justify-center rounded-lg', color)}>
                <Icon className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-foreground">{item.label}</p>
                <p className="truncate text-[10px] text-muted-foreground">{item.description}</p>
              </div>
              {selected && <Check className="ms-auto size-3.5 shrink-0 text-primary" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Step 4: Vendor profile ────────────────────────────────────────────────────

function StepProfile({
  data, setData, dict, errors,
}: {
  data: FlowData
  setData: (d: FlowData) => void
  dict: Dictionary['auth']['signup']
  errors: Record<string, string>
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (data.avatarPreview) URL.revokeObjectURL(data.avatarPreview)
    setData({ ...data, avatarFile: file, avatarPreview: URL.createObjectURL(file) })
  }

  const set = (k: keyof FlowData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setData({ ...data, [k]: e.target.value })

  return (
    <div className="space-y-4">
      {/* Avatar */}
      <div className="flex flex-col items-center gap-3 pb-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-muted transition-colors hover:bg-muted/70"
        >
          {data.avatarPreview ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.avatarPreview} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                <Camera className="size-6 text-white" />
              </div>
            </>
          ) : (
            <Camera className="size-8 text-muted-foreground" />
          )}
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={handleAvatar} />
        <div className="text-center">
          <p className="text-xs font-medium text-foreground">{dict.photoLabel}</p>
          <p className="text-[11px] text-muted-foreground">{dict.photoHint}</p>
        </div>
      </div>

      {/* City */}
      <div className="space-y-1.5">
        <Label htmlFor="city">{dict.city}</Label>
        <Input
          id="city" value={data.city} onChange={set('city')}
          placeholder={dict.cityPlaceholder}
          className={errors.city ? 'border-destructive' : ''}
        />
        {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
      </div>

      {/* Bio */}
      <div className="space-y-1.5">
        <Label htmlFor="bio">{dict.bio}</Label>
        <textarea
          id="bio"
          value={data.bio}
          onChange={set('bio')}
          placeholder={dict.bioPlaceholder}
          rows={3}
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-ring resize-none"
        />
      </div>

      {/* Rate */}
      <div className="space-y-1.5">
        <Label htmlFor="rate">{dict.rate}</Label>
        <Input
          id="rate" type="number" min="0" value={data.rate} onChange={set('rate')}
          placeholder={dict.ratePlaceholder}
        />
      </div>
    </div>
  )
}

// ── Success screen ────────────────────────────────────────────────────────────

function SuccessScreen({
  email, dict,
}: {
  email: string; dict: Dictionary['auth']['signup']
}) {
  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-border bg-card px-8 py-10 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Mail className="size-8 text-primary" />
        </div>
        <h2 className="mb-2 text-xl font-semibold text-foreground">{dict.confirmationTitle}</h2>
        <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
          {dict.confirmationText}{' '}
          <span className="font-semibold text-foreground">{email}</span>.
          <br />
          {dict.confirmationAction}
        </p>
        <div className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
          {dict.spamHint}
        </div>
      </div>
      <div className="mt-4 text-center text-sm text-muted-foreground">
        {dict.wrongEmail}&nbsp;
        <button
          onClick={() => window.location.reload()}
          className="font-medium text-foreground underline underline-offset-4"
        >
          {dict.signUpAgain}
        </button>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function SignupFlow({
  lang,
  dict,
}: {
  lang: string
  dict: Dictionary
}) {
  const t = dict.auth.signup
  const catDict = dict.categories.items

  const [step, setStep]     = useState<Step>('basics')
  const [data, setData]     = useState<FlowData>(INITIAL)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const steps       = data.role === 'vendor' ? VENDOR_STEPS : CLIENT_STEPS
  const stepIndex   = steps.indexOf(step)
  const stepTitles  = [t.step1Title, t.step2Title, t.step3Title, t.step4Title]
  const isLastStep  = step === 'profile' || (step === 'role' && data.role === 'client')

  // ── Validation ──────────────────────────────────────────────────────────────

  function validate(): boolean {
    const errs: Record<string, string> = {}

    if (step === 'basics') {
      if (!data.fullName.trim()) errs.fullName = 'Required'
      if (!data.phone.trim())    errs.phone    = 'Required'
      if (!data.email.trim() || !data.email.includes('@')) errs.email = 'Valid email required'
      if (data.password.length < 6) errs.password = 'At least 6 characters'
    }
    if (step === 'category' && !data.category) {
      errs.category = 'Please select a category'
    }
    if (step === 'profile' && !data.city.trim()) {
      errs.city = 'City is required'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handleRoleSelect(role: 'client' | 'vendor') {
    const next = data.role !== role ? role : data.role
    setData({ ...data, role: next })

    if (role === 'client') {
      // Clients are done — submit immediately
      handleSubmit({ ...data, role: 'client' })
    } else {
      setStep('category')
    }
  }

  function handleContinue() {
    if (!validate()) return
    const nextStep = steps[stepIndex + 1]
    if (nextStep) setStep(nextStep)
  }

  function handleBack() {
    const prevStep = steps[stepIndex - 1]
    if (prevStep) setStep(prevStep)
  }

  function handleSubmit(overrideData?: FlowData) {
    const d = overrideData ?? data
    startTransition(async () => {
      const fd = new FormData()
      fd.append('lang',      lang)
      fd.append('full_name', d.fullName)
      fd.append('phone',     d.phone)
      fd.append('email',     d.email)
      fd.append('password',  d.password)
      fd.append('role',      d.role)
      if (d.category) fd.append('category', d.category)
      if (d.city)     fd.append('city',     d.city)
      if (d.bio)      fd.append('bio',      d.bio)
      if (d.rate)     fd.append('rate',     d.rate)
      if (d.avatarFile) fd.append('avatar', d.avatarFile)

      const result = await signUpFull({ error: '' }, fd)
      if (result.error) {
        setServerError(result.error)
      } else if (result.success) {
        setSuccess(true)
      }
    })
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  if (success) {
    return <SuccessScreen email={data.email} dict={t} />
  }

  return (
    <div className="w-full max-w-md">
      {/* Step card */}
      <div
        key={step}
        className="rounded-2xl border border-border bg-card p-6 shadow-sm"
        style={{ animation: 'stepEnter 0.25s ease-out both' }}
      >
        {/* Step header */}
        {step !== 'role' && (
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-foreground">
              {step === 'basics'    ? t.step1Title    :
               step === 'category' ? t.categoryQuestion :
                                     t.profileQuestion}
            </h2>
            {step === 'profile' && (
              <p className="mt-0.5 text-sm text-muted-foreground">{t.profileSubtitle}</p>
            )}
          </div>
        )}
        {step === 'role' && (
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-foreground">{t.step2Title}</h2>
          </div>
        )}

        {/* Step content */}
        {step === 'basics' && (
          <StepBasics data={data} setData={setData} dict={t} errors={errors} />
        )}
        {step === 'role' && (
          <StepRole dict={t} onSelect={handleRoleSelect} />
        )}
        {step === 'category' && (
          <StepCategory data={data} setData={setData} dict={t} catDict={catDict} errors={errors} />
        )}
        {step === 'profile' && (
          <StepProfile data={data} setData={setData} dict={t} errors={errors} />
        )}

        {/* Server error */}
        {serverError && (
          <p className="mt-3 text-sm text-destructive" aria-live="polite">{serverError}</p>
        )}

        {/* Navigation — hidden on role step (card click advances) */}
        {step !== 'role' && (
          <div className="mt-6 flex items-center justify-between gap-3">
            {stepIndex > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1.5')}
              >
                <ArrowLeft className="size-3.5 rtl:rotate-180" />
                {t.back}
              </button>
            ) : (
              <span />
            )}

            {isLastStep ? (
              <Button
                size="sm"
                disabled={isPending}
                onClick={() => { if (validate()) handleSubmit() }}
                className="gap-1.5"
              >
                {isPending ? t.submitting : t.submit}
              </Button>
            ) : (
              <Button size="sm" onClick={handleContinue} className="gap-1.5">
                {t.continue}
                <ArrowRight className="size-3.5 rtl:rotate-180" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Sign-in link */}
      {step === 'basics' && (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {t.hasAccount}&nbsp;
          <Link
            href={`/${lang}/login`}
            className="font-medium text-foreground underline underline-offset-4"
          >
            {t.signIn}
          </Link>
        </p>
      )}
    </div>
  )
}
