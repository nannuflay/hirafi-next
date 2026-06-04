import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import type { Dictionary } from '@/app/[lang]/dictionaries'

type VendorDict = Dictionary['vendorCta']

export function VendorCTA({ dict, lang }: { dict: VendorDict; lang: string }) {
  return (
    <section id="for-pros" className="bg-foreground py-20 text-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="mb-4 inline-block rounded-full border border-background/20 bg-background/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-background/70">
              {dict.tag}
            </span>
            <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              {dict.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-background/70">
              {dict.subtitle}
            </p>
          </div>

          <div className="rounded-2xl border border-background/10 bg-background/5 p-8">
            <ul className="mb-8 space-y-4">
              {dict.benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-background/15">
                    <Check className="size-3" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
            <Link
              href={`/${lang}/signup?role=vendor`}
              className={cn(
                buttonVariants({ size: 'lg' }),
                'group w-full justify-center gap-2 bg-background text-foreground hover:bg-background/90'
              )}
            >
              {dict.cta}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
