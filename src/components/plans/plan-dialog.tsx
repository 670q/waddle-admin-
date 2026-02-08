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
import { Plus, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createPlanAdmin, updatePlanAdmin, Plan } from '@/app/actions/plan-actions'
import { Textarea } from '@/components/ui/textarea' // Using textarea for features list maybe? Or just comma separated input

interface PlanDialogProps {
    plan?: Plan
    trigger?: React.ReactNode
    onSuccess?: () => void
}

export function PlanDialog({ plan, trigger, onSuccess }: PlanDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<Partial<Plan>>({
        name: '',
        price: 0,
        currency: 'USD',
        interval: 'month',
        ai_message_limit: 10,
        features: [],
        is_active: true
    })
    const [featuresInput, setFeaturesInput] = useState('')
    const router = useRouter()

    useEffect(() => {
        if (plan) {
            setFormData(plan)
            setFeaturesInput(plan.features ? plan.features.join(', ') : '')
        }
    }, [plan])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Parse features
        const parsedFeatures = featuresInput.split(',').map(f => f.trim()).filter(f => f !== '')
        const submitData = { ...formData, features: parsedFeatures }

        try {
            if (plan?.id) {
                await updatePlanAdmin(plan.id, submitData)
            } else {
                // @ts-ignore
                await createPlanAdmin(submitData)
            }

            setOpen(false)
            onSuccess?.()
            router.refresh()
            alert('Plan saved successfully')
        } catch (error) {
            console.error(error)
            alert('Error saving plan')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button><Plus className="mr-2 h-4 w-4" /> Add Plan</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{plan ? 'Edit Plan' : 'Create Plan'}</DialogTitle>
                    <DialogDescription>
                        Configure subscription plan details and limits.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">Price</Label>
                        <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="limit" className="text-right">AI Limit</Label>
                        <Input
                            id="limit"
                            type="number"
                            value={formData.ai_message_limit}
                            onChange={(e) => setFormData({ ...formData, ai_message_limit: parseInt(e.target.value) })}
                            className="col-span-3"
                            required
                        />
                        <span className="col-span-4 text-xs text-muted-foreground text-right">Messages per day/month</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="features" className="text-right">Features</Label>
                        <div className="col-span-3">
                            <Textarea
                                id="features"
                                value={featuresInput}
                                onChange={(e) => setFeaturesInput(e.target.value)}
                                placeholder="Feature 1, Feature 2, Feature 3"
                            />
                            <p className="text-[10px] text-muted-foreground mt-1">Comma separated list</p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Plan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
