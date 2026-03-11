import { createAdminClient } from '@/lib/supabase/admin'

export interface AnalyticsOverview {
    totalUsers: number
    totalHabits: number
    totalCompletions: number
    totalFish: number
}

export interface DailyActivity {
    date: string
    completions: number
}

export interface AiUsage {
    date: string
    messages: number
}

export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
    const supabase = createAdminClient()

    // Total Users
    const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

    // Total Habits
    const { count: totalHabits } = await supabase
        .from('habits')
        .select('*', { count: 'exact', head: true })

    // Total Completions
    const { count: totalCompletions } = await supabase
        .from('habit_logs')
        .select('*', { count: 'exact', head: true })

    // Total Fish
    const { data: fishData } = await supabase
        .from('profiles')
        .select('fish')

    const totalFish = fishData?.reduce((sum: number, p: any) => sum + (p.fish || 0), 0) || 0

    return {
        totalUsers: totalUsers || 0,
        totalHabits: totalHabits || 0,
        totalCompletions: totalCompletions || 0,
        totalFish
    }
}

export async function getDailyActivity(days = 7): Promise<DailyActivity[]> {
    const supabase = createAdminClient()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    const startDateString = startDate.toISOString().split('T')[0]

    const { data } = await supabase
        .from('habit_logs')
        .select('completed_at')
        .gte('completed_at', startDateString)

    const grouped = data?.reduce((acc: Record<string, number>, log: any) => {
        if (!log.completed_at) return acc
        const date = log.completed_at.split('T')[0]
        acc[date] = (acc[date] || 0) + 1
        return acc
    }, {}) || {}

    // Ensure all days have an entry
    const result: DailyActivity[] = []
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const dateKey = d.toISOString().split('T')[0]
        result.push({
            date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            completions: grouped[dateKey] || 0
        })
    }

    return result
}

export async function getAiUsage(days = 7): Promise<AiUsage[]> {
    const supabase = createAdminClient()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    const startDateString = startDate.toISOString().split('T')[0]

    const { data } = await supabase
        .from('user_daily_usage')
        .select('usage_date, message_count')
        .gte('usage_date', startDateString)

    const grouped = data?.reduce((acc: Record<string, number>, log: any) => {
        if (!log.usage_date) return acc
        const date = log.usage_date.split('T')[0]
        acc[date] = (acc[date] || 0) + (log.message_count || 0)
        return acc
    }, {}) || {}

    // Ensure all days have an entry
    const result: AiUsage[] = []
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const dateKey = d.toISOString().split('T')[0]
        result.push({
            date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            messages: grouped[dateKey] || 0
        })
    }

    return result
}
