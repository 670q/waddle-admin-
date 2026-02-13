'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath, unstable_noStore as noStore } from 'next/cache'

interface Challenge {
    id?: string
    title: string
    description: string
    title_ar?: string
    title_en?: string
    description_ar?: string
    description_en?: string
    start_date: string
    end_date: string
    type: 'daily' | 'weekly'
    bg_color: string
    mascot?: string
}

export async function createChallengeAdmin(data: Challenge) {
    const supabase = createAdminClient()
    const { error } = await supabase
        .from('challenges')
        .insert([data])

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/dashboard/challenges')
    return { success: true }
}

export async function updateChallengeAdmin(id: string, data: Challenge) {
    const supabase = createAdminClient()
    const { error } = await supabase
        .from('challenges')
        .update(data)
        .eq('id', id)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/dashboard/challenges')
    return { success: true }
}

export async function deleteChallengeAdmin(id: string) {
    const supabase = createAdminClient()
    const { error } = await supabase
        .from('challenges')
        .delete()
        .eq('id', id)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/dashboard/challenges')
    return { success: true }
}

export async function getChallengesAdmin() {
    noStore()
    const supabase = createAdminClient()
    // Admin client bypasses RLS, so this should return all challenges even if RLS key logic is tricky
    const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching challenges:', error)
        return []
    }

    return data
}
