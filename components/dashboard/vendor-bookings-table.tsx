'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, CheckCircle2, CalendarDays } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
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
import { StatusBadge } from '@/components/dashboard/status-badge'
import type { Database } from '@/types/database'
import type { Dictionary } from '@/app/[lang]/dictionaries'

type BookingRow = Database['public']['Tables']['bookings']['Row']

interface BookingWithClient extends BookingRow {
  profiles: { full_name: string | null; avatar_url: string | null } | null
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
  const toastT = dict.toast
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
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id)
    if (error) {
      toast.error(toastT.actionFailed)
    } else {
      const msg = status === 'confirmed' ? toastT.bookingAccepted
        : status === 'cancelled' ? toastT.bookingDeclined
        : toastT.bookingCompleted
      toast.success(msg)
    }
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)))
    setLoading(null)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t.subtitle}</p>
        </div>
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
                <TableHead className="text-end">{t.actions}</TableHead>
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
                      <StatusBadge
                        status={booking.status}
                        label={t[booking.status as keyof typeof t]}
                      />
                    </TableCell>
                    <TableCell className="text-end">
                      {booking.status === 'pending' && (
                        <div className="flex ltr:justify-end rtl:justify-start gap-1.5">
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
