import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { STATUS_BADGE } from '@/lib/status-config'
import type { BookingStatus } from '@/types/database'

export function StatusBadge({
  status,
  label,
  className,
}: {
  status: BookingStatus
  label: string
  className?: string
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'text-[10px] uppercase tracking-wider',
        STATUS_BADGE[status],
        className,
      )}
    >
      {label}
    </Badge>
  )
}
