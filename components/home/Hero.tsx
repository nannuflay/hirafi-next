import Link from 'next/link'
import { ArrowRight, ShieldCheck, Star, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { HeroAnimation } from './HeroAnimation'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Page-wide subtle warm gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">

        {/* ── Left: copy ── */}
        <div
          className="flex flex-col items-start"
          style={{ animation: 'heroFadeUp 0.6s ease-out both' }}
        >
          {/* Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            <MapPin className="size-3" />
            Available across Morocco
          </div>

          {/* Headline */}
          <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-6xl">
            Find trusted<br />
            <span className="text-primary">professionals</span>,<br />
            book in minutes.
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            Connect with verified craftsmen for plumbing, electricity, moving,
            and more — directly in your city, no middlemen.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className={cn(buttonVariants({ size: 'lg' }), 'group gap-2 px-6')}
            >
              Find a professional
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/signup?role=vendor"
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'px-6')}
            >
              Offer your services
            </Link>
          </div>

          {/* Trust bar */}
          <div className="mt-10 flex flex-wrap gap-5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-primary" />
              Verified pros
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="size-4 text-primary" />
              Rated by real clients
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4 text-primary" />
              Local to your city
            </span>
          </div>

          {/* Stats */}
          <div className="mt-10 flex gap-8">
            {[
              { value: '500+', label: 'Professionals' },
              { value: '8', label: 'Cities' },
              { value: '1 200+', label: 'Jobs done' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-extrabold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: animation ── */}
        <div
          className="hidden lg:block"
          style={{ animation: 'heroFadeUp 0.6s ease-out 0.2s both' }}
        >
          <HeroAnimation />
        </div>
      </div>
    </section>
  )
}
