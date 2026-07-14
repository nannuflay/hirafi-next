'use client'

import { useState } from 'react'
import { CalendarDays } from 'lucide-react'
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

interface BookingWithVendor extends BookingRow {
  profiles: { full_name: string | null; avatar_url: string | null } | null
}

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
  completed: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800',
  cancelled: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800',
}

export function ClientBookingsTable({
  bookings: initial,
  lang,
  dict,
}: {
  bookings: BookingWithVendor[]
  lang: string
  dict: Dictionary
}) {
  const t = dict.dashboard.bookings
  const [bookings] = useState(initial)
  const [filter, setFilter] = useState<string>('all')

  const filtered = filter === 'all'
    ? bookings
    : bookings.filter((b) => b.status === filter)

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
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((booking) => {
                const vendor = booking.profiles
                const initials = (vendor?.full_name ?? 'V')
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
                          {vendor?.avatar_url ? (
                            <AvatarImage
                              src={vendor.avatar_url}
                              alt={vendor.full_name ?? ''}
                            />
                          ) : null}
                          <AvatarFallback className="bg-muted text-xs font-medium">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {vendor?.full_name ?? 'Professional'}
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
