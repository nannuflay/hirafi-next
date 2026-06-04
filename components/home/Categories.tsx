import Link from 'next/link'
import {
  Wrench,
  Zap,
  Settings2,
  Truck,
  Hammer,
  Paintbrush,
  Sparkles,
  LayoutGrid,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const categories = [
  {
    key: 'plumbing',
    label: 'Plumbing',
    description: 'Leaks, pipes, fixtures',
    icon: Wrench,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    key: 'electricity',
    label: 'Electricity',
    description: 'Wiring, panels, outlets',
    icon: Zap,
    color: 'bg-yellow-50 text-yellow-600',
  },
  {
    key: 'appliance_repair',
    label: 'Appliance Repair',
    description: 'Washing machines, fridges',
    icon: Settings2,
    color: 'bg-purple-50 text-purple-600',
  },
  {
    key: 'transport',
    label: 'Moving & Transport',
    description: 'Truck rental, relocation',
    icon: Truck,
    color: 'bg-green-50 text-green-600',
  },
  {
    key: 'carpentry',
    label: 'Carpentry',
    description: 'Furniture, doors, wood',
    icon: Hammer,
    color: 'bg-orange-50 text-orange-600',
  },
  {
    key: 'painting',
    label: 'Painting',
    description: 'Interior & exterior',
    icon: Paintbrush,
    color: 'bg-pink-50 text-pink-600',
  },
  {
    key: 'cleaning',
    label: 'Cleaning',
    description: 'Home & office cleaning',
    icon: Sparkles,
    color: 'bg-teal-50 text-teal-600',
  },
  {
    key: 'other',
    label: 'Other Services',
    description: 'More skilled workers',
    icon: LayoutGrid,
    color: 'bg-gray-100 text-gray-600',
  },
]

export function Categories() {
  return (
    <section id="categories" className="bg-muted/30 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Browse by service
          </h2>
          <p className="mt-3 text-muted-foreground">
            Pick a category to find available professionals near you.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map(({ key, label, description, icon: Icon, color }) => (
            <Link
              key={key}
              href="/signup"
              className="group flex flex-col gap-3 rounded-2xl border border-border bg-background p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className={cn('inline-flex size-10 items-center justify-center rounded-xl', color)}>
                <Icon className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
              </div>
              <ChevronRight className="mt-auto size-4 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
