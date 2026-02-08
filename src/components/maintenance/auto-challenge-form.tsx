'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { setAppConfig } from '@/app/actions/settings-actions'
import { autoGenerateChallenge } from '@/app/actions/ai-actions'
import { useRouter } from 'next/navigation'
import { Loader2, Sparkles, Clock, Zap } from 'lucide-react'

interface AutoChallengeFormProps {
    initialEnabled: boolean
    initialInterval: string
    initialType: string
    lastRun: string | null
}

export function AutoChallengeForm({
    initialEnabled,
    initialInterval,
    initialType,
    lastRun
}: AutoChallengeFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [enabled, setEnabled] = useState(initialEnabled)
    const [interval, setInterval] = useState(initialInterval || '24')
    const [challengeType, setChallengeType] = useState(initialType || 'both')
    const router = useRouter()

    const handleToggleEnabled = async (checked: boolean) => {
        setIsLoading(true)
        setEnabled(checked)
        try {
            await setAppConfig('auto_challenge_enabled', String(checked))
            router.refresh()
        } catch (error) {
            console.error(error)
            setEnabled(!checked)
            alert('Failed to update setting')
        } finally {
            setIsLoading(false)
        }
    }

    const handleIntervalChange = async (value: string) => {
        setIsLoading(true)
        setInterval(value)
        try {
            await setAppConfig('auto_challenge_interval_hours', value)
            router.refresh()
        } catch (error) {
            console.error(error)
            alert('Failed to update interval')
        } finally {
            setIsLoading(false)
        }
    }

    const handleTypeChange = async (value: string) => {
        setIsLoading(true)
        setChallengeType(value)
        try {
            await setAppConfig('auto_challenge_type', value)
            router.refresh()
        } catch (error) {
            console.error(error)
            alert('Failed to update type')
        } finally {
            setIsLoading(false)
        }
    }

    const handleGenerateNow = async () => {
        setIsGenerating(true)
        try {
            const result = await autoGenerateChallenge()
            if (result.success) {
                alert(`✅ Challenge "${result.title}" created successfully!`)
                router.refresh()
            } else {
                alert('Failed to generate challenge: ' + result.error)
            }
        } catch (error) {
            console.error(error)
            alert('Failed to generate challenge')
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Enable Toggle */}
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label htmlFor="auto-enabled">Enable Auto-Generation</Label>
                    <p className="text-sm text-muted-foreground">
                        Automatically create new challenges on a schedule
                    </p>
                </div>
                <Switch
                    id="auto-enabled"
                    checked={enabled}
                    onCheckedChange={handleToggleEnabled}
                    disabled={isLoading}
                />
            </div>

            {/* Interval Selector */}
            <div className="grid gap-2">
                <Label htmlFor="interval">Generation Interval</Label>
                <Select value={interval} onValueChange={handleIntervalChange} disabled={isLoading || !enabled}>
                    <SelectTrigger id="interval">
                        <Clock className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="6">Every 6 hours</SelectItem>
                        <SelectItem value="12">Every 12 hours</SelectItem>
                        <SelectItem value="24">Every 24 hours (Daily)</SelectItem>
                        <SelectItem value="48">Every 48 hours</SelectItem>
                        <SelectItem value="168">Every week</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Challenge Type Selector */}
            <div className="grid gap-2">
                <Label htmlFor="type">Challenge Type</Label>
                <Select value={challengeType} onValueChange={handleTypeChange} disabled={isLoading || !enabled}>
                    <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="daily">Daily Challenges Only</SelectItem>
                        <SelectItem value="weekly">Weekly Challenges Only</SelectItem>
                        <SelectItem value="both">Both (Alternating)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Last Run Info */}
            {lastRun && (
                <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Last generated:</span>{' '}
                    {new Date(lastRun).toLocaleString()}
                </div>
            )}

            {/* Generate Now Button */}
            <Button
                onClick={handleGenerateNow}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
                {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate Challenge Now
            </Button>

            {/* Cron Info */}
            <div className="rounded-lg bg-muted p-4 text-sm">
                <div className="flex items-center gap-2 font-medium mb-2">
                    <Zap className="h-4 w-4" />
                    Cron Endpoint
                </div>
                <code className="text-xs bg-background px-2 py-1 rounded block overflow-x-auto">
                    POST /api/cron/generate-challenge
                </code>
                <p className="text-muted-foreground mt-2 text-xs">
                    Use this endpoint with an external scheduler (Vercel Cron, cron-job.org) for automatic generation.
                </p>
            </div>
        </div>
    )
}
