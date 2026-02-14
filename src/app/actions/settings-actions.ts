'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export interface AppConfig {
    key: string
    value: string
}

export async function getAppConfig() {
    try {
        const supabase = createAdminClient()
        const { data, error } = await supabase
            .from('app_config')
            .select('*')
            .order('key', { ascending: true })

        if (error) {
            console.error('Error fetching app config:', error)
            return []
        }

        return data as AppConfig[]
    } catch (error) {
        console.error('Error fetching app config:', error)
        return []
    }
}

export async function updateAppConfig(key: string, value: string) {
    const supabase = createAdminClient()
    const { error } = await supabase
        .from('app_config')
        .update({ value })
        .eq('key', key)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/dashboard/settings')
    return { success: true }
}

export async function createAppConfig(key: string, value: string) {
    const supabase = createAdminClient()
    const { error } = await supabase
        .from('app_config')
        .insert([{ key, value }])

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/dashboard/settings')
    return { success: true }
}

export async function deleteAppConfig(key: string) {
    const supabase = createAdminClient()
    const { error } = await supabase
        .from('app_config')
        .delete()
        .eq('key', key)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/dashboard/settings')
    return { success: true }
}

export async function setAppConfig(key: string, value: string) {
    const supabase = createAdminClient()
    const { error } = await supabase
        .from('app_config')
        .upsert([{ key, value }], { onConflict: 'key' })

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/dashboard/settings')
    revalidatePath('/dashboard/maintenance')
    return { success: true }
}
