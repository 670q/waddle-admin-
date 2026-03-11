import { getAnalyticsOverview, getDailyActivity, getAiUsage } from '@/app/actions/analytics-actions'
import { AnalyticsCharts } from '@/components/analytics/analytics-charts'
import { Users, Target, CheckCircle2, Fish } from 'lucide-react'

export const metadata = {
    title: 'Analytics | Waddle Admin',
    description: 'Comprehensive analytics and usage statistics.',
}

export default async function AnalyticsPage() {
    // Fetch data concurrently for better performance
    const [overview, dailyData, aiData] = await Promise.all([
        getAnalyticsOverview(),
        getDailyActivity(7),
        getAiUsage(7)
    ])

    const statCards = [
        {
            title: 'Total Users',
            value: overview.totalUsers.toLocaleString(),
            icon: Users,
            description: 'Registered users in the app',
            color: 'text-blue-500',
            bg: 'bg-blue-50'
        },
        {
            title: 'Total Habits Created',
            value: overview.totalHabits.toLocaleString(),
            icon: Target,
            description: 'Custom & challenge habits',
            color: 'text-purple-500',
            bg: 'bg-purple-50'
        },
        {
            title: 'Habit Completions',
            value: overview.totalCompletions.toLocaleString(),
            icon: CheckCircle2,
            description: 'Total times a habit was marked done',
            color: 'text-green-500',
            bg: 'bg-green-50'
        },
        {
            title: 'Total Fish Earned',
            value: overview.totalFish.toLocaleString(),
            icon: Fish,
            description: 'Gamification points collected',
            color: 'text-orange-500',
            bg: 'bg-orange-50'
        }
    ]

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
                    <p className="text-muted-foreground">
                        Comprehensive overview of application usage and gamification metrics.
                    </p>
                </div>
            </div>

            {/* Overview Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, i) => (
                    <div key={i} className="rounded-xl border bg-card text-card-foreground shadow-sm">
                        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                            <h3 className="tracking-tight text-sm font-medium">{stat.title}</h3>
                            <div className={`p-2 rounded-full ${stat.bg}`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </div>
                        <div className="p-6 pt-0">
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stat.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Grid */}
            <AnalyticsCharts dailyData={dailyData} aiData={aiData} />

        </div>
    )
}
