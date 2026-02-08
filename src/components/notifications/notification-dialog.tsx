'use client'

import { useState } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Send, Loader2 } from 'lucide-react'
import { createAnnouncementAdmin } from '@/app/actions/notification-actions'
import { useRouter } from 'next/navigation'

export function NotificationDialog() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        body: '',
        target_audience: 'all'
    })
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await createAnnouncementAdmin(formData)
            setOpen(false)
            setFormData({ title: '', body: '', target_audience: 'all' })
            router.refresh()
            alert('Notification sent!')
        } catch (error) {
            console.error(error)
            alert('Failed to send notification')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Send className="mr-2 h-4 w-4" /> Send Notification
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Send Notification</DialogTitle>
                    <DialogDescription>
                        Send a push notification to your users.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            placeholder="e.g. New Challenge Available!"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            value={formData.body}
                            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                            required
                            placeholder="Type your message here..."
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="audience">Target Audience</Label>
                        <Select
                            value={formData.target_audience}
                            onValueChange={(val) => setFormData({ ...formData, target_audience: val })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Users</SelectItem>
                                <SelectItem value="active">Active Users (Last 30 days)</SelectItem>
                                <SelectItem value="inactive">Inactive Users</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Send Now'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
