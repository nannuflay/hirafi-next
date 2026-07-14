'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Bell,
  Clock,
  CheckCircle2,
  XCircle,
  Check,
  X,
  CalendarCheck,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { Database } from '@/types/database'
import type { Dictionary } from '@/app/[lang]/dictionaries'

type UserRole = 'client' | 'vendor'
type BookingStatus = Database['public']['Tables']['bookings']['Row']['status']
type Booking = Database['public']['Tables']['bookings']['Row']

interface NotificationBooking extends Booking {
  profiles: { full_name: string | null } | null
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

const STATUS_CONFIG: Record<
  BookingStatus,
  {
    color: string
    bgColor: string
    borderColor: string
    icon: typeof Clock
    badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline'
    dotColor: string
  }
> = {
  pending: {
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/40',
    borderColor: 'border-l-amber-500',
    icon: Clock,
    badgeVariant: 'outline',
    dotColor: 'bg-amber-500',
  },
  confirmed: {
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderColor: 'border-l-emerald-500',
    icon: CalendarCheck,
    badgeVariant: 'default',
    dotColor: 'bg-emerald-500',
  },
  completed: {
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/40',
    borderColor: 'border-l-blue-500',
    icon: CheckCircle2,
    badgeVariant: 'secondary',
    dotColor: 'bg-blue-500',
  },
  cancelled: {
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-950/40',
    borderColor: 'border-l-red-500',
    icon: XCircle,
    badgeVariant: 'destructive',
    dotColor: 'bg-red-500',
  },
}

function NotificationItem({
  booking,
  role,
  lang,
  t,
  onAction,
}: {
  booking: NotificationBooking
  role: UserRole
  lang: string
  t: Dictionary['dashboard']['notifications']
  onAction: (id: string, status: 'confirmed' | 'cancelled') => void
}) {
  const config = STATUS_CONFIG[booking.status]
  const Icon = config.icon
  const name = booking.profiles?.full_name ?? t.unknownUser
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const handleAction = async (status: 'confirmed' | 'cancelled') => {
    const supabase = createClient()
    await supabase
      .from('bookings')
      .update({ status })
      .eq('id', booking.id)
    onAction(booking.id, status)
  }

  return (
    <div
      className={cn(
        'relative flex gap-3 border-l-2 px-4 py-3 transition-colors hover:bg-muted/50',
        config.borderColor,
      )}
    >
      <div className="relative shrink-0">
        <Avatar size="default">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span
          className={cn(
            'absolute -right-0.5 -bottom-0.5 size-3 rounded-full ring-2 ring-background',
            config.dotColor,
          )}
        />
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm leading-snug">
            <span className="font-semibold">{name}</span>{' '}
            <span className="text-muted-foreground">
              {booking.status === 'pending' && t.actionPending}
              {booking.status === 'confirmed' && t.actionConfirmed}
              {booking.status === 'completed' && t.actionCompleted}
              {booking.status === 'cancelled' && t.actionCancelled}
            </span>
          </p>
          <Icon className={cn('mt-0.5 size-4 shrink-0', config.color)} />
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant={config.badgeVariant}
            className="text-[10px] uppercase tracking-wider"
          >
            {booking.status === 'pending' && t.badgePending}
            {booking.status === 'confirmed' && t.badgeConfirmed}
            {booking.status === 'completed' && t.badgeCompleted}
            {booking.status === 'cancelled' && t.badgeCancelled}
          </Badge>
          <span className="text-[11px] text-muted-foreground">
            {booking.booking_date}
          </span>
          <span className="text-[11px] text-muted-foreground">
            &middot; {timeAgo(booking.created_at)}
          </span>
        </div>

        {booking.status === 'pending' && role === 'vendor' && (
          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              className="h-7 gap-1 px-3 text-xs"
              onClick={(e) => {
                e.stopPropagation()
                handleAction('confirmed')
              }}
            >
              <Check className="size-3" />
              {t.accept}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 gap-1 px-3 text-xs"
              onClick={(e) => {
                e.stopPropagation()
                handleAction('cancelled')
              }}
            >
              <X className="size-3" />
              {t.decline}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export function NotificationBell({
  userId,
  role,
  lang,
  dict,
}: {
  userId: string
  role: UserRole
  lang: string
  dict: Dictionary
}) {
  const t = dict.dashboard.notifications
  const router = useRouter()
  const [bookings, setBookings] = useState<NotificationBooking[]>([])
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const fetchBookings = useCallback(async () => {
    const supabase = createClient()
    const FK =
      role === 'vendor'
        ? 'bookings_vendor_id_fkey'
        : 'bookings_client_id_fkey'

    const { data } = await supabase
      .from('bookings')
      .select(`*, profiles!${FK}(full_name)`)
      .eq(role === 'vendor' ? 'vendor_id' : 'client_id', userId)
      .order('created_at', { ascending: false })
      .limit(15)

    if (data) setBookings(data as NotificationBooking[])
  }, [userId, role])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('booking-notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter:
            role === 'vendor'
              ? `vendor_id=eq.${userId}`
              : `client_id=eq.${userId}`,
        },
        () => {
          fetchBookings()
          router.refresh()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, role, fetchBookings, router])

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  const pendingCount = bookings.filter((b) => b.status === 'pending').length

  const handleAction = (id: string, status: 'confirmed' | 'cancelled') => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b)),
    )
    router.refresh()
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'relative inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
          open && 'bg-muted text-foreground',
        )}
      >
        <Bell className="size-5" />
        {pendingCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex min-w-4.5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold             text-destructive-foreground shadow-sm">
            {pendingCount > 9 ? '9+' : pendingCount}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          className={cn(
            'absolute right-0 top-full z-50 mt-2 w-[400px] overflow-hidden rounded-xl border bg-card text-card-foreground shadow-2xl',
            'animate-in fade-in-0 zoom-in-95 slide-in-from-top-2',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold">{t.title}</h3>
              {pendingCount > 0 && (
                <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  {pendingCount} {t.newLabel}
                </span>
              )}
            </div>
            <button
              onClick={() => {
                router.push(`/${lang}/dashboard/${role}/bookings`)
                setOpen(false)
              }}
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {t.viewAll}
            </button>
          </div>

          {/* Notification list */}
          <div className="max-h-[420px] overflow-y-auto">
            {bookings.length === 0 ? (
              <div className="flex flex-col items-center gap-3 px-4 py-12">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                  <Bell className="size-5 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{t.emptyTitle}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {t.emptyDescription}
                  </p>
                </div>
              </div>
            ) : (
              bookings.map((b) => (
                <NotificationItem
                  key={b.id}
                  booking={b}
                  role={role}
                  lang={lang}
                  t={t}
                  onAction={handleAction}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
