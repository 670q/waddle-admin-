'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

import { MobileSidebar } from '@/components/layout/mobile-sidebar'

export function Header() {
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-card px-6">
            <MobileSidebar />
            <div className="flex-1">
                {/* Breadcrumbs or Title could go here */}
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
            </Button>
        </header>
    )
}
