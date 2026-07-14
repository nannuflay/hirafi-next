'use client'

import { Pie, PieChart } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

interface BookingsByStatusProps {
  data: Record<BookingStatus, number>
  title: string
  labels: Record<BookingStatus, string>
}

const chartConfig = {
  pending: { label: 'Pending', color: 'var(--chart-4)' },
  confirmed: { label: 'Confirmed', color: 'var(--chart-2)' },
  completed: { label: 'Completed', color: 'var(--chart-1)' },
  cancelled: { label: 'Cancelled', color: 'var(--chart-5)' },
} satisfies ChartConfig

const statusColors: Record<BookingStatus, string> = {
  pending: 'var(--chart-4)',
  confirmed: 'var(--chart-2)',
  completed: 'var(--chart-1)',
  cancelled: 'var(--chart-5)',
}

const DUMMY_DATA: Record<BookingStatus, number> = {
  pending: 4,
  confirmed: 2,
  completed: 8,
  cancelled: 1,
}

export function BookingsByStatus({ data, title, labels }: BookingsByStatusProps) {
  const total = Object.values(data).reduce((sum, v) => sum + v, 0)
  const displayData = total > 0 ? data : DUMMY_DATA
  const displayTotal = Object.values(displayData).reduce((sum, v) => sum + v, 0)

  const pieData = Object.entries(displayData)
    .filter(([, value]) => value > 0)
    .map(([key, value]) => ({
      status: key,
      count: value,
      fill: statusColors[key as BookingStatus],
    }))

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <ChartContainer config={chartConfig} className="h-[180px] w-[180px]">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={50}
                strokeWidth={2}
              />
              <ChartTooltip
                content={<ChartTooltipContent hideLabel />}
              />
            </PieChart>
          </ChartContainer>
          <div className="flex-1 space-y-3">
            {Object.entries(displayData).map(([key, value]) => {
              const color = statusColors[key as BookingStatus]
              const label = labels[key as BookingStatus]
              if (!label) return null
              const pct = displayTotal > 0 ? Math.round((value / displayTotal) * 100) : 0
              return (
                <div key={key} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 rounded-sm"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-muted-foreground">{label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium tabular-nums">{value}</span>
                    <span className="text-xs text-muted-foreground">({pct}%)</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
