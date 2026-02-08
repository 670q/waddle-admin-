import { NextRequest, NextResponse } from 'next/server'
import { autoGenerateChallenge } from '@/app/actions/ai-actions'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
    // Verify authorization
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    // Allow if no secret is set (for testing) or if secret matches
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if auto-generation is enabled
    const supabase = createAdminClient()
    const { data: config } = await supabase
        .from('app_config')
        .select('*')

    const enabled = config?.find((c: any) => c.key === 'auto_challenge_enabled')?.value === 'true'

    if (!enabled) {
        return NextResponse.json({
            success: false,
            message: 'Auto challenge generation is disabled'
        }, { status: 200 })
    }

    // Generate challenge
    const result = await autoGenerateChallenge()

    if (result.success) {
        return NextResponse.json({
            success: true,
            message: `Challenge "${result.title}" created successfully`,
            title: result.title
        })
    } else {
        return NextResponse.json({
            success: false,
            error: result.error
        }, { status: 500 })
    }
}

// Also allow GET for easy testing
export async function GET(request: NextRequest) {
    return POST(request)
}
