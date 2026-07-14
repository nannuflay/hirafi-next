'use client'

import { Bar, BarChart, XAxis, CartesianGrid } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const chartConfig = {
  bookings: {
    label: 'Bookings',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig

const DUMMY_DATA = [
  { month: 'Jan', bookings: 3 },
  { month: 'Feb', bookings: 5 },
  { month: 'Mar', bookings: 2 },
  { month: 'Apr', bookings: 8 },
  { month: 'May', bookings: 6 },
  { month: 'Jun', bookings: 4 },
]

interface MonthlyBookingsProps {
  data: { month: string; bookings: number }[]
  title: string
}

export function MonthlyBookings({ data, title }: MonthlyBookingsProps) {
  const hasData = data.some((d) => d.bookings > 0)
  const displayData = hasData ? data : DUMMY_DATA

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart data={displayData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={8}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="bookings"
              fill="var(--color-bookings)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
