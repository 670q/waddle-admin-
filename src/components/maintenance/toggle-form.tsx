'use client'

import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { setAppConfig } from '@/app/actions/settings-actions'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export function ToggleForm({ initialState }: { initialState: boolean }) {
    const [isLoading, setIsLoading] = useState(false)
    const [enabled, setEnabled] = useState(initialState)
    const router = useRouter()

    const handleToggle = async (checked: boolean) => {
        setIsLoading(true)
        setEnabled(checked) // Optimistic update

        try {
            await setAppConfig('maintenance_mode', String(checked))
            router.refresh()
        } catch (error) {
            console.error(error)
            setEnabled(!checked) // Revert
            alert('Failed to update maintenance mode')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center space-x-2">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            <Switch id="maintenance-mode" checked={enabled} onCheckedChange={handleToggle} disabled={isLoading} />
            <Label htmlFor="maintenance-mode">Enable Maintenance Mode</Label>
        </div>
    )
}
