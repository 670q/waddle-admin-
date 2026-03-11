'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { setAppConfig } from '@/app/actions/settings-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Save } from 'lucide-react'

interface ForceUpdateFormProps {
    initialVersion?: string
}

export function ForceUpdateForm({ initialVersion = '' }: ForceUpdateFormProps) {
    const [version, setVersion] = useState(initialVersion)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSave = async () => {
        if (!version.trim()) return

        try {
            setIsLoading(true)
            await setAppConfig('min_app_version', version.trim())
            router.refresh()
        } catch (error) {
            console.error('Failed to update minimum app version:', error)
            alert('Failed to update minimum app version')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="grid gap-2">
                <Label htmlFor="min_version">Minimum App Version Required</Label>
                <div className="flex items-center gap-3">
                    <Input
                        id="min_version"
                        value={version}
                        onChange={(e) => setVersion(e.target.value)}
                        placeholder="e.g. 1.0.0"
                        className="max-w-[200px]"
                    />
                    <Button onClick={handleSave} disabled={isLoading || version === initialVersion}>
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="mr-2 h-4 w-4" />
                        )}
                        Save Version
                    </Button>
                </div>
            </div>
            <p className="text-sm text-muted-foreground">
                Any older version of the Waddle mobile app will be completely blocked until the user updates to this version (or newer). Set this string precisely matching the version format of your app, or leave it blank to disable forcing updates.
            </p>
        </div>
    )
}
