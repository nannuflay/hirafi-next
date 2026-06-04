import Link from 'next/link'
import {
  Wrench, Zap, Settings2, Truck, Hammer,
  Paintbrush, Sparkles, LayoutGrid, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Dictionary } from '@/app/[lang]/dictionaries'

type CatDict = Dictionary['categories']

const CATEGORY_META = [
  { key: 'plumbing',        icon: Wrench,     color: 'bg-blue-50 text-blue-600' },
  { key: 'electricity',     icon: Zap,        color: 'bg-yellow-50 text-yellow-600' },
  { key: 'applianceRepair', icon: Settings2,  color: 'bg-purple-50 text-purple-600' },
  { key: 'transport',       icon: Truck,      color: 'bg-green-50 text-green-600' },
  { key: 'carpentry',       icon: Hammer,     color: 'bg-orange-50 text-orange-600' },
  { key: 'painting',        icon: Paintbrush, color: 'bg-pink-50 text-pink-600' },
  { key: 'cleaning',        icon: Sparkles,   color: 'bg-teal-50 text-teal-600' },
  { key: 'other',           icon: LayoutGrid, color: 'bg-gray-100 text-gray-600' },
] as const

export function Categories({ dict, lang }: { dict: CatDict; lang: string }) {
  return (
    <section id="categories" className="bg-muted/30 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {dict.title}
          </h2>
          <p className="mt-3 text-muted-foreground">{dict.subtitle}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORY_META.map(({ key, icon: Icon, color }) => {
            const item = dict.items[key]
            return (
              <Link
                key={key}
                href={`/${lang}/signup`}
                className="group flex flex-col gap-3 rounded-2xl border border-border bg-background p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className={cn('inline-flex size-10 items-center justify-center rounded-xl', color)}>
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
                </div>
                <ChevronRight className="mt-auto size-4 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground rtl:rotate-180" />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
