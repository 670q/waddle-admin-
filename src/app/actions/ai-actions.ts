'use server'

import { createAdminClient } from '@/lib/supabase/admin'

interface GeneratedChallenge {
    title: string
    description: string
    type: 'daily' | 'weekly'
    bg_color: string
    duration_days: number
}

const TEMPLATES = [
    {
        title: "Early Bird",
        description: "Wake up before 6 AM for 5 days in a row.",
        type: 'daily',
        bg_color: '#F59E0B', // Amber
        duration_days: 5
    },
    {
        title: "Hydration Hero",
        description: "Drink 3 liters of water every day.",
        type: 'daily',
        bg_color: '#3B82F6', // Blue
        duration_days: 7
    },
    {
        title: "Read 30 Pages",
        description: "Focus on reading at least 30 pages of a book.",
        type: 'daily',
        bg_color: '#10B981', // Green
        duration_days: 3
    },
    {
        title: "No Sugar Week",
        description: "Avoid all added sugars for a whole week.",
        type: 'weekly',
        bg_color: '#EF4444', // Red
        duration_days: 7
    },
    {
        title: "Meditation Master",
        description: "Meditate for 10 minutes daily.",
        type: 'daily',
        bg_color: '#8B5CF6', // Purple
        duration_days: 14
    }
]

export async function generateChallengeAI(topic?: string): Promise<GeneratedChallenge> {
    // Simulate AI delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // In a real scenario, we would call OpenAI here with the 'topic'
    // For now, return a random template
    const randomIndex = Math.floor(Math.random() * TEMPLATES.length)
    return TEMPLATES[randomIndex] as GeneratedChallenge
}

export async function autoGenerateChallenge(preferredType?: 'daily' | 'weekly' | 'both') {
    const supabase = createAdminClient()

    try {
        // Get settings
        const { data: config } = await supabase
            .from('app_config')
            .select('*')

        const typeConfig = config?.find((c: any) => c.key === 'auto_challenge_type')?.value || preferredType || 'both'

        // Generate challenge using AI
        const generated = await generateChallengeAI()

        // Determine type based on config
        let challengeType = generated.type
        if (typeConfig === 'daily') challengeType = 'daily'
        else if (typeConfig === 'weekly') challengeType = 'weekly'
        // if 'both', use AI's suggestion

        // Calculate dates
        const startDate = new Date()
        startDate.setDate(startDate.getDate() + 1)
        const endDate = new Date(startDate)
        endDate.setDate(startDate.getDate() + generated.duration_days)

        // Create challenge
        const { error } = await supabase
            .from('challenges')
            .insert([{
                title: generated.title,
                description: generated.description,
                type: challengeType,
                bg_color: generated.bg_color,
                start_date: startDate.toISOString().split('T')[0],
                end_date: endDate.toISOString().split('T')[0]
            }])

        if (error) {
            return { success: false, error: error.message }
        }

        // Update last run timestamp
        await supabase
            .from('app_config')
            .upsert([{ key: 'auto_challenge_last_run', value: new Date().toISOString() }], { onConflict: 'key' })

        return { success: true, title: generated.title }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}
