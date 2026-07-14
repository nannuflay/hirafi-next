import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { getDictionary, type Locale } from '../../dictionaries'
import { CalendarDays, Clock, CheckCircle2, Hammer } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export default async function ClientDashboardPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  const t = dict.dashboard

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) notFound()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, profiles!bookings_vendor_id_fkey(full_name, avatar_url, city)')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const allBookings = bookings ?? []
  const pendingCount = allBookings.filter(b => b.status === 'pending').length
  const completedCount = allBookings.filter(b => b.status === 'completed').length

  const statusColor = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
    completed: 'bg-green-100 text-green-700 border-green-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
  } as const

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {t.overview.welcome}, {profile?.full_name?.split(' ')[0] ?? 'there'} 👋
        </h1>
        <p className="mt-1 text-muted-foreground">
          Find and book local professionals in your city.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t.overview.totalBookings}</p>
                <p className="mt-1 text-3xl font-bold tracking-tight">{allBookings.length}</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                <CalendarDays className="size-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t.overview.pendingBookings}</p>
                <p className="mt-1 text-3xl font-bold tracking-tight">{pendingCount}</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-xl bg-yellow-500/10">
                <Clock className="size-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t.overview.completedBookings}</p>
                <p className="mt-1 text-3xl font-bold tracking-tight">{completedCount}</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-xl bg-green-500/10">
                <CheckCircle2 className="size-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">{t.overview.recentBookings}</CardTitle>
          <Link href={`/${lang}/dashboard/client/bookings`} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1 text-xs")}>
              {t.overview.viewAll} <ArrowUpRight className="size-3" />
          </Link>
        </CardHeader>
        <CardContent>
          {allBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-muted">
                <Hammer className="size-6 text-muted-foreground" />
              </div>
              <p className="mt-4 text-sm font-medium">{t.overview.noBookings}</p>
              <p className="mt-1 text-xs text-muted-foreground">Browse professionals and book one to get started.</p>
              <Link href={`/${lang}`} className={cn(buttonVariants({ size: "sm" }), "mt-4")}>
                Browse services
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {allBookings.map((booking) => {
                const vendor = booking.profiles as unknown as { full_name: string; avatar_url: string | null; city: string | null } | null
                return (
                  <div
                    key={booking.id}
                    className="flex items-center gap-4 rounded-xl border border-border p-3 transition-colors hover:bg-muted/50"
                  >
                    <Avatar className="size-10 border border-border">
                      {vendor?.avatar_url ? (
                        <AvatarImage src={vendor.avatar_url} alt={vendor.full_name ?? ''} />
                      ) : null}
                      <AvatarFallback className="bg-muted text-xs font-medium">
                        {(vendor?.full_name ?? 'V').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium">{vendor?.full_name ?? 'Professional'}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(booking.booking_date).toLocaleDateString('en-US', {
                          weekday: 'short', month: 'short', day: 'numeric',
                        })}
                        {vendor?.city && ` · ${vendor.city}`}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={statusColor[booking.status as keyof typeof statusColor]}
                    >
                      {t.bookings[booking.status as keyof typeof t.bookings]}
                    </Badge>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
