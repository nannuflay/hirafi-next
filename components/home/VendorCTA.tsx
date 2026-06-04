import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

const benefits = [
  'Free profile — list your services in minutes',
  'You control your schedule and availability',
  'Clients come to you — no cold outreach needed',
  'Get rated and build your reputation',
]

export function VendorCTA() {
  return (
    <section id="for-pros" className="bg-foreground py-20 text-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left */}
          <div>
            <span className="mb-4 inline-block rounded-full border border-background/20 bg-background/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-background/70">
              For professionals
            </span>
            <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Are you a skilled craftsman?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-background/70">
              Join hundreds of professionals already growing their client base on Hirafi.
              Set your own rates, publish your available dates, and let clients book you directly.
            </p>
          </div>

          {/* Right */}
          <div className="rounded-2xl border border-background/10 bg-background/5 p-8">
            <ul className="mb-8 space-y-4">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-background/15">
                    <Check className="size-3" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
            <Link
              href="/signup?role=vendor"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'group w-full justify-center gap-2 bg-background text-foreground hover:bg-background/90'
              )}
            >
              Create your free profile
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
