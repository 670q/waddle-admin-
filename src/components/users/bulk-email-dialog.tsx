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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Mail, Loader2, Users } from 'lucide-react'
import { sendBulkEmailAdmin } from '@/app/actions/user-actions'

export function BulkEmailDialog({ search, totalUsersText }: { search: string, totalUsersText: string }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')

    const handleSend = async () => {
        if (!subject.trim() || !message.trim()) {
            alert('Please enter a subject and a message.')
            return
        }

        if (!confirm(`Are you sure you want to send this email to ${totalUsersText} users? Make sure you haven't exceeded your Resend daily limits.`)) {
            return
        }

        setLoading(true)
        try {
            const result = await sendBulkEmailAdmin(search, subject, message)
            alert(result.message)
            setOpen(false)
            setSubject('')
            setMessage('')
        } catch (err: any) {
            console.error('Failed to send bulk email:', err)
            alert(`Failed: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default" className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Users className="h-4 w-4" />
                    <span>Bulk Email {totalUsersText}</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Send Bulk Email</DialogTitle>
                    <DialogDescription>
                        Send an email to {totalUsersText} {search ? `(matching "${search}")` : '(all users)'}.
                        <br />
                        <span className="text-destructive font-medium mt-2 inline-block">Notice: Resend free tier is limited to 100 emails per day.</span>
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="bulk-subject">Subject</Label>
                        <Input
                            id="bulk-subject"
                            placeholder="e.g. Waddle Update: New Features!"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="bulk-message">Message</Label>
                        <Textarea
                            id="bulk-message"
                            placeholder="Type your message here..."
                            className="min-h-[150px]"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSend} disabled={loading || !subject.trim() || !message.trim()}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send to All
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
