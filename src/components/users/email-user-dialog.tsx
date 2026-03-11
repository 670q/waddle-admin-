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
import { Mail, Loader2 } from 'lucide-react'
import { sendUserEmailAdmin } from '@/app/actions/user-actions'

export function EmailUserDialog({ userId, email }: { userId: string, email?: string }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')

    const handleSend = async () => {
        if (!subject.trim() || !message.trim()) {
            alert('Please enter a subject and a message.')
            return
        }

        setLoading(true)
        try {
            await sendUserEmailAdmin(userId, subject, message)
            alert('Email sent successfully!')
            setOpen(false)
            setSubject('')
            setMessage('')
        } catch (err: any) {
            console.error('Failed to send email:', err)
            alert(`Failed to send email: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Mail className="h-4 w-4" />
                    <span>Send Email</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Send Direct Email</DialogTitle>
                    <DialogDescription>
                        Send an email directly to {email || 'this user'}. They will receive it from Waddle Support.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                            id="subject"
                            placeholder="e.g. Action Required: Account Update"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
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
                        Send Email
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
