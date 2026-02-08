'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const data = [
    {
        name: 'Jan',
        total: 12,
    },
    {
        name: 'Feb',
        total: 30,
    },
    {
        name: 'Mar',
        total: 45,
    },
    {
        name: 'Apr',
        total: 80,
    },
    {
        name: 'May',
        total: 120,
    },
    {
        name: 'Jun',
        total: 156,
    },
]

export function UserGrowthChart() {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>User Growth</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={data}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip
                            contentStyle={{ background: 'transparent', border: 'none' }}
                            itemStyle={{ color: '#000' }}
                            cursor={{ stroke: 'gray', strokeWidth: 1 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="total"
                            stroke="#2563eb"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
