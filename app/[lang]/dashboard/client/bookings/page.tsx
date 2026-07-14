import { getDictionary, type Locale } from '../../../dictionaries'
import { CalendarDays } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default async function ClientBookingsPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const t = (await getDictionary(lang as Locale)).dashboard

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">{t.bookings.title}</h1>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-muted">
            <CalendarDays className="size-6 text-muted-foreground" />
          </div>
          <p className="mt-4 text-sm font-medium">{t.bookings.empty}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t.bookings.emptyHint}</p>
        </CardContent>
      </Card>
    </div>
  )
}
