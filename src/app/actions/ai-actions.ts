'use server'

import { createAdminClient } from '@/lib/supabase/admin'

interface GeneratedChallenge {
    title: string
    title_ar: string
    title_en: string
    description: string
    description_ar: string
    description_en: string
    type: 'daily' | 'weekly'
    bg_color: string
    duration_days: number
    mascot?: string
}

const TEMPLATES = [
    {
        title: "Early Bird",
        title_ar: "صباح النشاط",
        title_en: "Early Bird",
        description: "Wake up before 6 AM for 5 days in a row.",
        description_ar: "استيقظ قبل الساعة 6 صباحاً لمدة 5 أيام متتالية.",
        description_en: "Wake up before 6 AM for 5 days in a row.",
        type: 'daily',
        bg_color: '#F59E0B',
        duration_days: 5
    },
    {
        title: "Hydration Hero",
        title_ar: "بطل الترطيب",
        title_en: "Hydration Hero",
        description: "Drink 3 liters of water every day.",
        description_ar: "اشرب 3 لترات من الماء يومياً.",
        description_en: "Drink 3 liters of water every day.",
        type: 'daily',
        bg_color: '#3B82F6',
        duration_days: 7
    },
    {
        title: "Read 30 Pages",
        title_ar: "اقرأ 30 صفحة",
        title_en: "Read 30 Pages",
        description: "Focus on reading at least 30 pages of a book.",
        description_ar: "ركز على قراءة 30 صفحة على الأقل من كتاب.",
        description_en: "Focus on reading at least 30 pages of a book.",
        type: 'daily',
        bg_color: '#10B981',
        duration_days: 3
    },
    {
        title: "No Sugar Week",
        title_ar: "أسبوع بدون سكر",
        title_en: "No Sugar Week",
        description: "Avoid all added sugars for a whole week.",
        description_ar: "تجنب جميع السكريات المضافة لمدة أسبوع كامل.",
        description_en: "Avoid all added sugars for a whole week.",
        type: 'weekly',
        bg_color: '#EF4444',
        duration_days: 7
    },
    {
        title: "Meditation Master",
        title_ar: "سيد التأمل",
        title_en: "Meditation Master",
        description: "Meditate for 10 minutes daily.",
        description_ar: "تأمل لمدة 10 دقائق يومياً.",
        description_en: "Meditate for 10 minutes daily.",
        type: 'daily',
        bg_color: '#8B5CF6',
        duration_days: 14
    },
    {
        title: "Walk 10,000 Steps",
        title_ar: "امشِ 10,000 خطوة",
        title_en: "Walk 10,000 Steps",
        description: "Complete 10,000 steps every day.",
        description_ar: "أكمل 10,000 خطوة كل يوم.",
        description_en: "Complete 10,000 steps every day.",
        type: 'daily',
        bg_color: '#06B6D4',
        duration_days: 7
    },
    {
        title: "Digital Detox",
        title_ar: "استراحة رقمية",
        title_en: "Digital Detox",
        description: "No social media for 2 hours before bed.",
        description_ar: "بدون سوشيال ميديا لمدة ساعتين قبل النوم.",
        description_en: "No social media for 2 hours before bed.",
        type: 'daily',
        bg_color: '#EC4899',
        duration_days: 5
    },
    {
        title: "Gratitude Journal",
        title_ar: "يوميات الامتنان",
        title_en: "Gratitude Journal",
        description: "Write 3 things you're grateful for each day.",
        description_ar: "اكتب 3 أشياء تشكر الله عليها كل يوم.",
        description_en: "Write 3 things you're grateful for each day.",
        type: 'daily',
        bg_color: '#F97316',
        duration_days: 7
    },
    {
        title: "Healthy Sleep Week",
        title_ar: "أسبوع النوم الصحي",
        title_en: "Healthy Sleep Week",
        description: "Sleep 7-8 hours every night for a week.",
        description_ar: "نم 7-8 ساعات كل ليلة لمدة أسبوع.",
        description_en: "Sleep 7-8 hours every night for a week.",
        type: 'weekly',
        bg_color: '#6366F1',
        duration_days: 7
    },
    {
        title: "Workout Warrior",
        title_ar: "محارب التمارين",
        title_en: "Workout Warrior",
        description: "Exercise for at least 30 minutes daily.",
        description_ar: "تمرن لمدة 30 دقيقة على الأقل يومياً.",
        description_en: "Exercise for at least 30 minutes daily.",
        type: 'daily',
        bg_color: '#DC2626',
        duration_days: 5
    },
    {
        title: "Mindful Eating",
        title_ar: "الأكل الواعي",
        title_en: "Mindful Eating",
        description: "Eat slowly without screens for every meal.",
        description_ar: "كل ببطء بدون شاشات في كل وجبة.",
        description_en: "Eat slowly without screens for every meal.",
        type: 'weekly',
        bg_color: '#059669',
        duration_days: 7
    },
    {
        title: "Morning Stretch",
        title_ar: "تمدد الصباح",
        title_en: "Morning Stretch",
        description: "Stretch for 10 minutes every morning.",
        description_ar: "تمدد لمدة 10 دقائق كل صباح.",
        description_en: "Stretch for 10 minutes every morning.",
        type: 'daily',
        bg_color: '#14B8A6',
        duration_days: 7
    }
]


export async function generateChallengeAI(topic?: string): Promise<GeneratedChallenge> {
    const supabase = createAdminClient()

    // Call the Edge Function
    const { data, error } = await supabase.functions.invoke('generate-challenge', {
        body: { topic } // Optional topic passing
    })

    if (error) {
        console.error('Edge Function Error:', error)
        throw new Error('Failed to generate challenge')
    }

    return data as GeneratedChallenge
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
                title_ar: generated.title_ar,
                title_en: generated.title_en,
                description: generated.description,
                description_ar: generated.description_ar,
                description_en: generated.description_en,
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
