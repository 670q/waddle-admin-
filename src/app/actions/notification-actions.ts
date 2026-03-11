'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export interface Announcement {
    id?: string
    title: string
    body: string
    target_audience: string // 'all', 'active', 'inactive' etc.
    is_sent: boolean
    created_at?: string
}

export async function createAnnouncementAdmin(data: Omit<Announcement, 'id' | 'created_at' | 'is_sent'>) {
    const supabase = createAdminClient()

    // 1. Insert announcement with is_sent = false (pending)
    const { data: inserted, error } = await supabase
        .from('announcements')
        .insert([{
            ...data,
            is_sent: false
        }])
        .select()
        .single()

    if (error) {
        throw new Error(error.message)
    }

    // 2. Call push-dispatcher Edge Function to send REAL push notifications
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    let pushSuccess = false
    try {
        const pushResponse = await fetch(
            `${supabaseUrl}/functions/v1/push-dispatcher`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${serviceRoleKey}`,
                },
                body: JSON.stringify({ record: inserted }),
            }
        )

        if (pushResponse.ok) {
            pushSuccess = true
        } else {
            const errBody = await pushResponse.text()
            console.error('[Push] Edge Function error:', pushResponse.status, errBody)
        }
    } catch (e) {
        console.error('[Push] Failed to call push-dispatcher:', e)
    }

    // 3. Mark as sent after successful push
    if (pushSuccess) {
        await supabase
            .from('announcements')
            .update({ is_sent: true })
            .eq('id', inserted.id)
    }

    revalidatePath('/dashboard/notifications')
    return { success: true, pushSent: pushSuccess }
}

export async function getAnnouncementsAdmin() {
    try {
        const supabase = createAdminClient()
        const { data, error } = await supabase
            .from('announcements')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching announcements:', error)
            return []
        }

        return data as Announcement[]
    } catch (error) {
        console.error('Error fetching announcements:', error)
        return []
    }
}
