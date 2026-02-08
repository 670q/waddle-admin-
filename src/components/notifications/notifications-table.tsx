'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge' // Need to ensure badge is installed or use fallback style
import { CheckCheck } from 'lucide-react'

// Note: Badge component might need installation: npx shadcn@latest add badge
// I'll use a fallback span style for now to avoid extra installation steps unless requested.

interface Announcement {
    id: string
    title: string
    body: string
    target_audience: string
    is_sent: boolean
    created_at: string
}

export function NotificationsTable({ announcements }: { announcements: Announcement[] }) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Audience</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Sent Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {announcements.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                No past notifications.
                            </TableCell>
                        </TableRow>
                    ) : (
                        announcements.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.title}</TableCell>
                                <TableCell className="max-w-[300px] truncate" title={item.body}>
                                    {item.body}
                                </TableCell>
                                <TableCell className="capitalize">
                                    <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                        {item.target_audience}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {item.is_sent && (
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <CheckCheck className="h-3 w-3 text-green-500" /> Sent
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="text-right text-xs text-muted-foreground">
                                    {new Date(item.created_at).toLocaleDateString()} {new Date(item.created_at).toLocaleTimeString()}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
