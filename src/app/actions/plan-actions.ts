'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export interface Plan {
    id: string
    name: string
    price: number
    currency: string
    interval: string
    ai_message_limit: number
    features: string[]
    is_active: boolean
    created_at?: string
}

export async function getPlansAdmin() {
    const supabase = createAdminClient()
    const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price', { ascending: true })

    if (error) {
        console.error('Error fetching plans:', error)
        return []
    }

    return data as Plan[]
}

export async function updatePlanAdmin(id: string, updates: Partial<Plan>) {
    const supabase = createAdminClient()
    const { error } = await supabase
        .from('subscription_plans')
        .update(updates)
        .eq('id', id)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/dashboard/plans')
    return { success: true }
}

export async function createPlanAdmin(plan: Omit<Plan, 'id' | 'created_at'>) {
    const supabase = createAdminClient()
    const { error } = await supabase
        .from('subscription_plans')
        .insert([plan])

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/dashboard/plans')
    return { success: true }
}

export async function togglePlanStatusAdmin(id: string, isActive: boolean) {
    return updatePlanAdmin(id, { is_active: isActive })
}
