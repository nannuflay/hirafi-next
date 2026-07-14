'use client'

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

const DUMMY_DATA = [
  { month: 'Jan', revenue: 450 },
  { month: 'Feb', revenue: 900 },
  { month: 'Mar', revenue: 300 },
  { month: 'Apr', revenue: 1200 },
  { month: 'May', revenue: 750 },
  { month: 'Jun', revenue: 600 },
]

interface RevenueTrendProps {
  data: { month: string; revenue: number }[]
  title: string
  currency?: string
}

export function RevenueTrend({ data, title, currency = 'MAD' }: RevenueTrendProps) {
  const hasData = data.some((d) => d.revenue > 0)
  const displayData = hasData ? data : DUMMY_DATA

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <AreaChart data={displayData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={8}
              axisLine={false}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) =>
                    `${Number(value).toLocaleString()} ${currency}`
                  }
                />
              }
            />
            <Area
              dataKey="revenue"
              fill="var(--color-revenue)"
              fillOpacity={0.2}
              stroke="var(--color-revenue)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
