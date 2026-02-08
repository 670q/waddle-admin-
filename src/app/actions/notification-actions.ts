'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

interface Announcement {
    id?: string
    title: string
    body: string
    target_audience: string // 'all', 'active', 'inactive' etc.
    is_sent: boolean
    created_at?: string
}

export async function createAnnouncementAdmin(data: Omit<Announcement, 'id' | 'created_at' | 'is_sent'>) {
    const supabase = createAdminClient()

    // Default is_sent to false, or true if we assume immediate sending? 
    // Usually "announcements" table implies sent messages or queued. 
    // Let's assume created = sent for now as per "is_sent" column existence implies a queue or status. 
    // For simplicity, we set is_sent: true immediately as we don't have a background worker yet.

    const { error } = await supabase
        .from('announcements')
        .insert([{
            ...data,
            is_sent: true
        }])

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/dashboard/notifications')
    return { success: true }
}

export async function getAnnouncementsAdmin() {
    const supabase = createAdminClient()
    const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching announcements:', error)
        return []
    }

    return data
}
