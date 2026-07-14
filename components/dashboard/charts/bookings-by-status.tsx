'use client'

import { Pie, PieChart, Cell } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { STATUS_CHART } from '@/lib/status-config'

type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

interface BookingsByStatusProps {
  data: Record<BookingStatus, number>
  title: string
  labels: Record<BookingStatus, string>
}

const STATUS_KEYS: BookingStatus[] = ['pending', 'confirmed', 'completed', 'cancelled']

const chartConfig = {
  pending: { label: 'Pending', color: 'var(--chart-4)' },
  confirmed: { label: 'Confirmed', color: 'var(--chart-2)' },
  completed: { label: 'Completed', color: 'var(--chart-1)' },
  cancelled: { label: 'Cancelled', color: 'var(--chart-5)' },
} satisfies ChartConfig

export function BookingsByStatus({ data, title, labels }: BookingsByStatusProps) {
  const total = Object.values(data).reduce((sum, v) => sum + v, 0)

  const pieData = STATUS_KEYS
    .filter((key) => data[key] > 0)
    .map((key) => ({
      status: key,
      count: data[key],
      fill: `var(--color-${key})`,
    }))

  const configWithLabels = {
    pending: { ...chartConfig.pending, label: labels.pending },
    confirmed: { ...chartConfig.confirmed, label: labels.confirmed },
    completed: { ...chartConfig.completed, label: labels.completed },
    cancelled: { ...chartConfig.cancelled, label: labels.cancelled },
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-6 pt-4">
        {/* Donut */}
        <div className="relative shrink-0">
          <ChartContainer
            config={configWithLabels}
            className="size-[160px]"
          >
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    hideLabel
                    nameKey="status"
                    formatter={(value, name) => {
                      const pct = total > 0 ? Math.round(((value as number) / total) * 100) : 0
                      const label = labels[name as BookingStatus] ?? name
                      return (
                        <div className="flex items-center gap-2">
                          <span
                            className="size-2 shrink-0 rounded-full"
                            style={{ backgroundColor: STATUS_CHART[name as BookingStatus] }}
                          />
                          <span className="text-muted-foreground">{label}</span>
                          <span className="ml-auto font-mono font-medium tabular-nums">
                            {value} <span className="text-muted-foreground">({pct}%)</span>
                          </span>
                        </div>
                      )
                    }}
                  />
                }
              />
              <Pie
                data={pieData}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                strokeWidth={0}
                paddingAngle={3}
              >
                {pieData.map((entry) => (
                  <Cell key={entry.status} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>

          {/* Center total */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold tabular-nums tracking-tight text-foreground">
              {total}
            </span>
            <span className="text-[10px] text-muted-foreground">
              Total
            </span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="flex-1 space-y-3">
          {STATUS_KEYS.map((key) => {
            const value = data[key]
            if (!labels[key]) return null
            const pct = total > 0 ? Math.round((value / total) * 100) : 0

            return (
              <div key={key} className="flex items-center gap-3">
                <span
                  className="size-2.5 shrink-0 rounded-sm"
                  style={{ backgroundColor: STATUS_CHART[key] }}
                />
                <span className="flex-1 text-sm text-muted-foreground">
                  {labels[key]}
                </span>
                <div className="flex items-center gap-2 tabular-nums">
                  <span className="w-4 text-right text-sm font-medium text-foreground">
                    {value}
                  </span>
                  <span className="w-9 text-right text-xs text-muted-foreground">
                    {pct}%
                  </span>
                </div>
              </div>
            )
          })}

          {total === 0 && (
            <p className="py-4 text-center text-xs text-muted-foreground">
              No data yet
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
