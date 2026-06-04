import { Search, CalendarCheck, BadgeCheck } from 'lucide-react'
import type { Dictionary } from '@/app/[lang]/dictionaries'

type HowDict = Dictionary['howItWorks']

const STEP_ICONS = [Search, CalendarCheck, BadgeCheck]

export function HowItWorks({ dict }: { dict: HowDict }) {
  return (
    <section id="how-it-works" className="bg-background py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {dict.title}
          </h2>
          <p className="mt-3 text-muted-foreground">{dict.subtitle}</p>
        </div>

        <div className="relative grid gap-8 md:grid-cols-3">
          <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-border md:block" />

          {dict.steps.map((step, i) => {
            const Icon = STEP_ICONS[i]
            return (
              <div key={step.number} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 mb-5 flex size-14 items-center justify-center rounded-full border-2 border-border bg-background shadow-sm">
                  <Icon className="size-6 text-foreground" />
                </div>
                <span className="mb-1 text-xs font-semibold tracking-widest text-muted-foreground">
                  STEP {step.number}
                </span>
                <h3 className="mb-2 text-base font-semibold text-foreground">{step.title}</h3>
                <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
