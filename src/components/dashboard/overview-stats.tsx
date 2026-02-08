'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Trophy, CheckCircle } from 'lucide-react'

interface DashboardStatsProps {
    stats: {
        total_users: number
        active_challenges: number
        total_habits_completed: number
    }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total_users}</div>
                    <p className="text-xs text-muted-foreground">
                        +12% from last month
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Challenges</CardTitle>
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.active_challenges}</div>
                    <p className="text-xs text-muted-foreground">
                        Currently running
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Habits Completed</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total_habits_completed}</div>
                    <p className="text-xs text-muted-foreground">
                        Total completions
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
