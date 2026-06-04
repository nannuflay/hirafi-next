import { Search, CalendarCheck, BadgeCheck } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Browse & filter',
    description:
      'Search by service category and city. Browse professional profiles with ratings, rates, and availability.',
  },
  {
    number: '02',
    icon: CalendarCheck,
    title: 'Pick a time slot',
    description:
      'Each professional publishes their open dates. Pick the slot that works for you and confirm the booking instantly.',
  },
  {
    number: '03',
    icon: BadgeCheck,
    title: 'Job done',
    description:
      'The professional shows up at the agreed time. Rate them after the job to help the community.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-background py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Book a pro in 3 steps
          </h2>
          <p className="mt-3 text-muted-foreground">
            No phone calls, no guessing — just a few clicks.
          </p>
        </div>

        <div className="relative grid gap-8 md:grid-cols-3">
          {/* Connector line (desktop) */}
          <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-border md:block" />

          {steps.map(({ number, icon: Icon, title, description }) => (
            <div key={number} className="relative flex flex-col items-center text-center">
              {/* Step circle */}
              <div className="relative z-10 mb-5 flex size-14 items-center justify-center rounded-full border-2 border-border bg-background shadow-sm">
                <Icon className="size-6 text-foreground" />
              </div>

              <span className="mb-1 text-xs font-semibold tracking-widest text-muted-foreground">
                STEP {number}
              </span>
              <h3 className="mb-2 text-base font-semibold text-foreground">{title}</h3>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
