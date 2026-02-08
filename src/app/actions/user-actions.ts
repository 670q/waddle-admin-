'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function getUsersAdmin(search: string = '', page: number = 1, pageSize: number = 20) {
    const supabase = createAdminClient()

    // Use listUsers from auth.admin
    // Note: search in listUsers is limited. We might need to filter manually or rely on basic email matching if supported.
    // listUsers supports 'query' param for filtering.

    // Note: auth.admin.listUsers usually returns all users if no params.
    // Pagination is supported via page and perPage.
    const { data, error } = await supabase.auth.admin.listUsers({
        page: page,
        perPage: pageSize,
        // This is a simple query, might not support partial match like ILIKE depending on Supabase version
        // But it's safer than raw SQL
    })

    if (error) {
        console.error('Error fetching users:', error)
        return { users: [], total: 0 }
    }

    let users = data.users

    // Manual filtering for search if provided (since listUsers query might be restrictive)
    if (search) {
        users = users.filter(u => u.email?.toLowerCase().includes(search.toLowerCase()))
    }

    // Map to our User interface style
    // We need to fetch ban status from user_metadata or app_metadata
    const mappedUsers = users.map(u => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
        // @ts-ignore
        // Safer check: explicitly check it exists and is not 'none'
        is_banned: (u.ban_duration && u.ban_duration !== 'none') || false
    }))

    // Debug log
    // console.log('Parsed Users:', mappedUsers.map(u => ({ email: u.email, banned: u.is_banned, raw_duration: (u as any).ban_duration })))

    return { users: mappedUsers, total: data.total }
}

export async function deleteUserAdmin(userId: string) {
    const supabase = createAdminClient()
    const { error } = await supabase.auth.admin.deleteUser(userId)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/dashboard/users')
    return { success: true }
}

export async function banUserAdmin(userId: string, banDuration: string = '876000h') { // 100 years default
    const supabase = createAdminClient()
    const { error } = await supabase.auth.admin.updateUserById(userId, {
        ban_duration: banDuration
    })

    if (error) {
        throw new Error(error.message)
    }
    revalidatePath('/dashboard/users')
    return { success: true }
}

export async function unbanUserAdmin(userId: string) {
    const supabase = createAdminClient()
    const { error } = await supabase.auth.admin.updateUserById(userId, {
        ban_duration: 'none'
    })

    if (error) {
        throw new Error(error.message)
    }
    revalidatePath('/dashboard/users')
    return { success: true }
}

export async function getUserDetails(userId: string) {
    const supabase = createAdminClient()

    // 1. Fetch Basic Info (Auth)
    const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(userId)
    if (userError || !user) {
        throw new Error('User not found')
    }

    // 2. Fetch Habits
    const { data: habits } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    // 3. Fetch Recent Logs
    const { data: logs } = await supabase
        .from('habit_logs')
        .select('*, habits(title)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20)

    // 4. Fetch Challenges
    // Fetch user_challenges first
    const { data: userChallenges } = await supabase
        .from('user_challenges')
        .select('*')
        .eq('user_id', userId)

    // Manually fetch challenge details
    let enrichedChallenges = []
    if (userChallenges && userChallenges.length > 0) {
        const challengeIds = userChallenges.map((uc: any) => uc.challenge_id)
        const { data: challengeDetails } = await supabase
            .from('challenges')
            .select('*')
            .in('id', challengeIds)

        enrichedChallenges = userChallenges.map((uc: any) => {
            const detail = challengeDetails?.find(c => c.id === uc.challenge_id)
            return { ...uc, challenge: detail }
        })
    }

    // 5. Fetch Usage Stats
    const { data: usage } = await supabase
        .from('user_daily_usage')
        .select('*')
        .eq('user_id', userId)
        .order('usage_date', { ascending: false })
        .limit(30)

    return {
        user,
        habits: habits || [],
        logs: logs || [],
        challenges: enrichedChallenges,
        usage: usage || []
    }
}
