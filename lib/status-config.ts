import type { BookingStatus } from '@/types/database'

export const STATUS_BADGE: Record<BookingStatus, string> = {
  pending:
    'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
  confirmed:
    'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
  completed:
    'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800',
  cancelled:
    'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800',
}

export const STATUS_DOT: Record<BookingStatus, string> = {
  pending: 'bg-amber-500',
  confirmed: 'bg-emerald-500',
  completed: 'bg-blue-500',
  cancelled: 'bg-red-500',
}

export const STATUS_TEXT: Record<BookingStatus, string> = {
  pending: 'text-amber-600 dark:text-amber-400',
  confirmed: 'text-emerald-600 dark:text-emerald-400',
  completed: 'text-blue-600 dark:text-blue-400',
  cancelled: 'text-red-600 dark:text-red-400',
}

export const STATUS_BORDER_LEFT: Record<BookingStatus, string> = {
  pending: 'border-l-amber-500',
  confirmed: 'border-l-emerald-500',
  completed: 'border-l-blue-500',
  cancelled: 'border-l-red-500',
}

export const STATUS_CHART: Record<BookingStatus, string> = {
  pending: 'var(--chart-4)',
  confirmed: 'var(--chart-2)',
  completed: 'var(--chart-1)',
  cancelled: 'var(--chart-5)',
}
