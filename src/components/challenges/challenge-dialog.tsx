'use client'

import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

import { Plus, Loader2, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createChallengeAdmin, updateChallengeAdmin } from '@/app/actions/challenge-actions'
import { generateChallengeAI } from '@/app/actions/ai-actions'

interface Challenge {
    id?: string
    title: string
    description: string
    title_ar?: string
    title_en?: string
    description_ar?: string
    description_en?: string
    start_date: string
    end_date: string
    type: 'daily' | 'weekly'
    bg_color: string
    mascot?: string
    joined_count_mode?: 'real' | 'random' | 'custom'
    joined_count?: number | null
}

interface ChallengeDialogProps {
    challenge?: Challenge
    trigger?: React.ReactNode
    onSuccess?: () => void
}

export function ChallengeDialog({ challenge, trigger, onSuccess }: ChallengeDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [aiLoading, setAiLoading] = useState(false)
    const [formData, setFormData] = useState<Partial<Challenge>>({
        title: '',
        description: '',
        title_ar: '',
        title_en: '',
        description_ar: '',
        description_en: '',
        type: 'daily',
        start_date: '',
        end_date: '',
        bg_color: '#3b82f6',
        mascot: 'idle',
        joined_count_mode: 'random',
        joined_count: null,
    })
    const [applyToAll, setApplyToAll] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (challenge) {
            setFormData({
                ...challenge,
                title_ar: challenge.title_ar || '',
                title_en: challenge.title_en || '',
                description_ar: challenge.description_ar || '',
                description_en: challenge.description_en || '',
                mascot: challenge.mascot || 'idle',
                joined_count_mode: challenge.joined_count_mode || 'random',
                joined_count: challenge.joined_count ?? null,
            })
        }
    }, [challenge])

    const handleGenerateAI = async () => {
        setAiLoading(true)
        try {
            const generated = await generateChallengeAI()
            const startDate = new Date()
            startDate.setDate(startDate.getDate() + 1)
            const endDate = new Date(startDate)
            endDate.setDate(startDate.getDate() + generated.duration_days)

            setFormData(prev => ({
                ...prev,
                title: generated.title,
                title_ar: generated.title_ar || generated.title, // Fallback if AI misses it
                title_en: generated.title_en || generated.title,
                description: generated.description,
                description_ar: generated.description_ar || generated.description,
                description_en: generated.description_en || generated.description,
                type: generated.type,
                bg_color: generated.bg_color,
                mascot: generated.mascot || 'idle',
                start_date: startDate.toISOString().split('T')[0],
                end_date: endDate.toISOString().split('T')[0]
            }))
        } catch (error) {
            console.error(error)
            alert('Failed to generate challenge')
        } finally {
            setAiLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (challenge?.id) {
                await updateChallengeAdmin(challenge.id, formData as Challenge, applyToAll)
            } else {
                await createChallengeAdmin(formData as Challenge, applyToAll)
            }

            setOpen(false)
            onSuccess?.()
            router.refresh()
        } catch (error) {
            console.error(error)
            alert('Error saving challenge')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button><Plus className="mr-2 h-4 w-4" /> Add Challenge</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{challenge ? 'Edit Challenge' : 'Create Challenge'}</DialogTitle>
                    <DialogDescription>
                        {challenge ? 'Update challenge details.' : 'Add a new challenge for users to join.'}
                    </DialogDescription>
                </DialogHeader>

                {!challenge && (
                    <div className="flex justify-end mb-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleGenerateAI}
                            disabled={aiLoading}
                            className="bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100"
                        >
                            {aiLoading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Sparkles className="mr-2 h-3 w-3" />}
                            Generate with AI
                        </Button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Title (Default)
                        </Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title_ar" className="text-right">Title (AR)</Label>
                        <Input
                            id="title_ar"
                            value={formData.title_ar}
                            onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                            className="col-span-3"
                            placeholder="العنوان بالعربي"
                            dir="rtl"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title_en" className="text-right">Title (EN)</Label>
                        <Input
                            id="title_en"
                            value={formData.title_en}
                            onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                            className="col-span-3"
                            placeholder="English Title"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="desc" className="text-right">Description</Label>
                        <Input
                            id="desc"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="desc_ar" className="text-right">Desc (AR)</Label>
                        <Input
                            id="desc_ar"
                            value={formData.description_ar}
                            onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                            className="col-span-3"
                            placeholder="الوصف بالعربي"
                            dir="rtl"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="desc_en" className="text-right">Desc (EN)</Label>
                        <Input
                            id="desc_en"
                            value={formData.description_en}
                            onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                            className="col-span-3"
                            placeholder="English Description"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="start" className="text-right">Start</Label>
                        <Input
                            id="start"
                            type="date"
                            value={formData.start_date}
                            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="end" className="text-right">End</Label>
                        <Input
                            id="end"
                            type="date"
                            value={formData.end_date}
                            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="color" className="text-right">Color</Label>
                        <div className="col-span-3 flex items-center gap-2">
                            <Input
                                id="color"
                                type="color"
                                value={formData.bg_color}
                                onChange={(e) => setFormData({ ...formData, bg_color: e.target.value })}
                                className="w-12 p-1 h-8"
                            />
                            <span className="text-xs text-muted-foreground">Background Color</span>
                        </div>
                    </div>

                    {/* Participant Count Mode */}
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="text-right pt-2">Participants</Label>
                        <div className="col-span-3 space-y-2">
                            <div className="flex gap-2">
                                {(['random', 'real', 'custom'] as const).map((mode) => (
                                    <button
                                        key={mode}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, joined_count_mode: mode })}
                                        className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${formData.joined_count_mode === mode
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                            }`}
                                    >
                                        {mode === 'random' ? '🎲 Random' : mode === 'real' ? '👥 Real' : '✏️ Custom'}
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {formData.joined_count_mode === 'random' && 'Random number between 10-9999 (stable per challenge)'}
                                {formData.joined_count_mode === 'real' && 'Shows the actual number of users who joined'}
                                {formData.joined_count_mode === 'custom' && 'Set a specific number manually'}
                            </p>
                            {formData.joined_count_mode === 'custom' && (
                                <Input
                                    type="number"
                                    min={0}
                                    max={99999}
                                    placeholder="Enter participant count"
                                    value={formData.joined_count ?? ''}
                                    onChange={(e) => setFormData({ ...formData, joined_count: e.target.value ? parseInt(e.target.value) : null })}
                                />
                            )}

                            {/* Apply to All Checkbox */}
                            <div className="flex items-center space-x-2 mt-3 pt-3 border-t">
                                <input
                                    type="checkbox"
                                    id="applyToAll"
                                    checked={applyToAll}
                                    onChange={(e) => setApplyToAll(e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                />
                                <Label htmlFor="applyToAll" className="text-sm font-medium text-slate-700 cursor-pointer">
                                    Apply these participant settings to ALL challenges
                                </Label>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="text-right pt-2">Mascot</Label>
                        <div className="col-span-3 grid grid-cols-4 gap-2">
                            {[
                                { id: 'wave', src: '/mascot/a1.png', label: 'Wave' },
                                { id: 'thinking', src: '/mascot/a2.png', label: 'Thinking' },
                                { id: 'celebrate', src: '/mascot/a5.png', label: 'Celebrate' },
                                { id: 'cool', src: '/mascot/a6.png', label: 'Cool' },
                                { id: 'fishing', src: '/mascot/a7.png', label: 'Fishing' },
                                { id: 'sleeping', src: '/mascot/a8.png', label: 'Sleeping' },
                                { id: 'confused', src: '/mascot/a9.png', label: 'Confused' },
                                { id: 'paywall', src: '/mascot/paywall.png', label: 'Paywall' }
                            ].map((m) => (
                                <div
                                    key={m.id}
                                    onClick={() => setFormData({ ...formData, mascot: m.id })}
                                    className={`
                                        cursor-pointer rounded-md border p-2 text-center text-xs transition-all flex flex-col items-center justify-center
                                        ${formData.mascot === m.id ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-500' : 'border-slate-200 hover:bg-slate-50'}
                                    `}
                                >
                                    <img
                                        src={m.src}
                                        alt={m.label}
                                        className="h-10 w-10 object-contain mb-1"
                                    />
                                    <span>{m.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Challenge'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    )
}
