'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, CheckCircle2, CalendarDays } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import type { Database } from '@/types/database'
import type { Dictionary } from '@/app/[lang]/dictionaries'

type BookingRow = Database['public']['Tables']['bookings']['Row']

interface BookingWithClient extends BookingRow {
  profiles: { full_name: string | null; avatar_url: string | null } | null
}

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
  completed: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800',
  cancelled: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800',
}

export function VendorBookingsTable({
  bookings: initial,
  lang,
  dict,
}: {
  bookings: BookingWithClient[]
  lang: string
  dict: Dictionary
}) {
  const t = dict.dashboard.bookings
  const router = useRouter()
  const [bookings, setBookings] = useState(initial)
  const [filter, setFilter] = useState<string>('all')
  const [loading, setLoading] = useState<string | null>(null)

  const filtered = filter === 'all'
    ? bookings
    : bookings.filter((b) => b.status === filter)

  const handleAction = async (id: string, status: 'confirmed' | 'cancelled' | 'completed') => {
    setLoading(id)
    const supabase = createClient()
    await supabase.from('bookings').update({ status }).eq('id', id)
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)))
    setLoading(null)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{t.title}</h1>
        <Select value={filter} onValueChange={(v) => setFilter(v ?? 'all')}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.filterAll}</SelectItem>
            <SelectItem value="pending">{t.filterPending}</SelectItem>
            <SelectItem value="confirmed">{t.filterConfirmed}</SelectItem>
            <SelectItem value="completed">{t.filterCompleted}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-muted">
              <CalendarDays className="size-6 text-muted-foreground" />
            </div>
            <p className="mt-4 text-sm font-medium">{t.empty}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t.emptyHint}</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.client}</TableHead>
                <TableHead>{t.date}</TableHead>
                <TableHead>{t.status}</TableHead>
                <TableHead className="text-right">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((booking) => {
                const client = booking.profiles
                const initials = (client?.full_name ?? 'C')
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()

                return (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar size="sm">
                          {client?.avatar_url ? (
                            <AvatarImage
                              src={client.avatar_url}
                              alt={client.full_name ?? ''}
                            />
                          ) : null}
                          <AvatarFallback className="bg-muted text-xs font-medium">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {client?.full_name ?? 'Client'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(booking.booking_date).toLocaleDateString(
                        lang === 'ar' ? 'ar-MA' : lang === 'fr' ? 'fr-FR' : 'en-US',
                        { weekday: 'short', month: 'short', day: 'numeric' },
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-[10px] uppercase tracking-wider',
                          STATUS_STYLE[booking.status],
                        )}
                      >
                        {t[booking.status as keyof typeof t]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {booking.status === 'pending' && (
                        <div className="flex justify-end gap-1.5">
                          <Button
                            size="sm"
                            className="h-7 gap-1 px-2.5 text-xs"
                            disabled={loading === booking.id}
                            onClick={() => handleAction(booking.id, 'confirmed')}
                          >
                            <Check className="size-3" />
                            {t.accept}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 gap-1 px-2.5 text-xs"
                            disabled={loading === booking.id}
                            onClick={() => handleAction(booking.id, 'cancelled')}
                          >
                            <X className="size-3" />
                            {t.decline}
                          </Button>
                        </div>
                      )}
                      {booking.status === 'confirmed' && (
                        <Button
                          size="sm"
                          className="h-7 gap-1 px-2.5 text-xs"
                          disabled={loading === booking.id}
                          onClick={() => handleAction(booking.id, 'completed')}
                        >
                          <CheckCircle2 className="size-3" />
                          {t.complete}
                        </Button>
                      )}
                      {(booking.status === 'completed' ||
                        booking.status === 'cancelled') && (
                        <span className="text-xs text-muted-foreground">&mdash;</span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
