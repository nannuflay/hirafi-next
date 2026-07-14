import Link from 'next/link'
import { ArrowRight, ShieldCheck, Star, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { HeroAnimation } from './HeroAnimation'
import type { Dictionary } from '@/app/[lang]/dictionaries'

type HeroDict = Dictionary['hero']

export function Hero({ dict, lang, userRole }: { dict: HeroDict; lang: string; userRole: string | null }) {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">

        <div
          className="flex flex-col items-start"
          style={{ animation: 'heroFadeUp 0.6s ease-out both' }}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            <MapPin className="size-3" />
            {dict.badge}
          </div>

          <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-6xl">
            {dict.titleStart}{' '}
            <span className="text-primary">{dict.titleHighlight}</span>
            {dict.titleEnd}
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            {dict.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {userRole ? (
              <Link
                href={`/${lang}/dashboard/${userRole}`}
                className={cn(buttonVariants({ size: 'lg' }), 'group gap-2 px-6')}
              >
                {dict.goToDashboard}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
              </Link>
            ) : (
              <>
                <Link
                  href={`/${lang}/signup`}
                  className={cn(buttonVariants({ size: 'lg' }), 'group gap-2 px-6')}
                >
                  {dict.findPro}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
                </Link>
                <Link
                  href={`/${lang}/signup?role=vendor`}
                  className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'px-6')}
                >
                  {dict.offerServices}
                </Link>
              </>
            )}
          </div>

          <div className="mt-10 flex flex-wrap gap-5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-primary" />
              {dict.verifiedPros}
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="size-4 text-primary" />
              {dict.ratedByClients}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4 text-primary" />
              {dict.localToCity}
            </span>
          </div>

          <div className="mt-10 flex gap-8">
            {[
              { value: '500+', label: dict.stats.professionals },
              { value: '8',    label: dict.stats.cities },
              { value: '1 200+', label: dict.stats.jobsDone },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-extrabold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

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
