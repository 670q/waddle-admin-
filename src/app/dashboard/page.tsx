import { createAdminClient } from '@/lib/supabase/admin'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Trophy, Activity, TrendingUp } from 'lucide-react'

// Metrics fetching
async function getDashboardStats() {
    const supabase = createAdminClient()

    // 1. Total Users
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }) // Assuming profiles exist, or auth.users which we can't select count easily from without RPC or listUsers loop. 
    // Actually, auth.admin.listUsers provides total count.
    const { data: userData } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 })
    const totalUsers = (userData as any)?.total || 0

    // 2. Active Challenges (challenges where end_date >= now)
    const { count: activeChallenges } = await supabase
        .from('challenges')
        .select('*', { count: 'exact', head: true })
        .gte('end_date', new Date().toISOString())

    // 3. Total Habits Completed (count from habit_logs)
    const { count: completedHabits } = await supabase
        .from('habit_logs')
        .select('*', { count: 'exact', head: true })
        .eq('completed', true)

    return {
        totalUsers,
        activeChallenges: activeChallenges || 0,
        completedHabits: completedHabits || 0
    }
}

export default async function DashboardPage() {
    // Determine dynamic behavior
    const stats = await getDashboardStats()

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsers}</div>
                        <p className="text-xs text-muted-foreground">
                            Registered accounts
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Challenges</CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeChallenges}</div>
                        <p className="text-xs text-muted-foreground">
                            Ongoing competitions
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Habits Completed</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.completedHabits}</div>
                        <p className="text-xs text-muted-foreground">
                            Total completions logged
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* User Growth Chart Placeholder - Recharts implementation would go here */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>User Growth</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                            <TrendingUp className="mr-2 h-4 w-4" /> Chart data coming soon
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
