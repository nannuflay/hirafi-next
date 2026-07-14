import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { getDictionary, type Locale } from '../../dictionaries'
import { CalendarDays, Clock, CheckCircle2, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

export default async function VendorDashboardPage({
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
    .select('*, vendor_services(*)')
    .eq('id', user.id)
    .single()

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, profiles!bookings_client_id_fkey(full_name, avatar_url)')
    .eq('vendor_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const allBookings = bookings ?? []
  const pendingCount = allBookings.filter(b => b.status === 'pending').length
  const completedCount = allBookings.filter(b => b.status === 'completed').length
  const totalRevenue = allBookings
    .filter(b => b.status === 'completed')
    .reduce((sum) => sum + (profile?.vendor_services?.rate ?? 0), 0)

  const statusColor = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
    completed: 'bg-green-100 text-green-700 border-green-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
  } as const

  const initials = (profile?.full_name ?? 'V')
    .split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {t.overview.welcome}, {profile?.full_name?.split(' ')[0] ?? 'there'} 👋
        </h1>
        <p className="mt-1 text-muted-foreground">
          {t.overview.title}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
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

        <Card className="relative overflow-hidden">
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

        <Card className="relative overflow-hidden">
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

        <Card className="relative overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t.overview.monthlyRevenue}</p>
                <p className="mt-1 text-3xl font-bold tracking-tight">
                  {totalRevenue.toLocaleString()} <span className="text-sm font-medium text-muted-foreground">{t.overview.earningsLabel}</span>
                </p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                <TrendingUp className="size-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent bookings + Profile card */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Bookings table */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">{t.overview.recentBookings}</CardTitle>
          </CardHeader>
          <CardContent>
            {allBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-muted">
                  <CalendarDays className="size-6 text-muted-foreground" />
                </div>
                <p className="mt-4 text-sm font-medium">{t.overview.noBookings}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t.overview.noBookingsHint}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {allBookings.map((booking) => {
                  const client = booking.profiles as unknown as { full_name: string; avatar_url: string | null } | null
                  return (
                    <div
                      key={booking.id}
                      className="flex items-center gap-4 rounded-xl border border-border p-3 transition-colors hover:bg-muted/50"
                    >
                      <Avatar className="size-10 border border-border">
                        {client?.avatar_url ? (
                          <AvatarImage src={client.avatar_url} alt={client.full_name ?? ''} />
                        ) : null}
                        <AvatarFallback className="bg-muted text-xs font-medium">
                          {(client?.full_name ?? 'C').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium">{client?.full_name ?? 'Client'}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(booking.booking_date).toLocaleDateString('en-US', {
                            weekday: 'short', month: 'short', day: 'numeric',
                          })}
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

        {/* Profile card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t.profile.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-col items-center text-center">
              <Avatar className="size-20 border-2 border-border">
                {profile?.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} alt={profile.full_name ?? ''} className="object-cover" />
                ) : null}
                <AvatarFallback className="bg-muted text-xl font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <h3 className="mt-3 text-base font-semibold">{profile?.full_name}</h3>
              <p className="text-sm text-muted-foreground">{profile?.city}</p>
            </div>

            <div className="space-y-3 rounded-xl bg-muted/50 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t.profile.category}</span>
                <span className="font-medium capitalize">
                  {dict.categories.items[profile?.vendor_services?.category as keyof typeof dict.categories.items]?.label ?? '—'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t.profile.rate}</span>
                <span className="font-medium">{profile?.vendor_services?.rate ?? '—'} MAD</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t.profile.phone}</span>
                <span className="font-medium">{profile?.phone ?? '—'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t.profile.memberSince}</span>
                <span className="font-medium">
                  {new Date(profile?.created_at ?? '').toLocaleDateString('en-US', {
                    month: 'short', year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {profile?.vendor_services?.bio && (
              <div>
                <p className="text-sm font-medium">{t.profile.bio}</p>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {profile.vendor_services.bio}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
