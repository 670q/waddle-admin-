'use client'

import { useState, useEffect, useCallback } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Loader2, Trash2, Edit } from 'lucide-react'
import { ChallengeDialog } from './challenge-dialog'
import { getChallengesAdmin, deleteChallengeAdmin } from '@/app/actions/challenge-actions'

export function ChallengesTable() {
    const [challenges, setChallenges] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchChallenges = useCallback(async () => {
        setLoading(true)
        try {
            const data = await getChallengesAdmin()
            setChallenges(data || [])
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchChallenges()
    }, [fetchChallenges])

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this challenge?')) return

        try {
            await deleteChallengeAdmin(id)
            fetchChallenges()
        } catch (error) {
            alert('Failed to delete')
        }
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                            </TableCell>
                        </TableRow>
                    ) : challenges.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                No challenges found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        challenges.map((challenge) => (
                            <TableRow key={challenge.id}>
                                <TableCell className="font-medium">{challenge.title}</TableCell>
                                <TableCell className="capitalize">{challenge.type || 'daily'}</TableCell>
                                <TableCell>
                                    {challenge.start_date} - {challenge.end_date}
                                </TableCell>
                                <TableCell>
                                    {challenge.is_active ? (
                                        <span className="text-green-600 font-medium text-xs">Active</span>
                                    ) : (
                                        <span className="text-muted-foreground font-medium text-xs">Inactive</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <ChallengeDialog
                                        challenge={challenge}
                                        onSuccess={fetchChallenges}
                                        trigger={
                                            <Button variant="ghost" size="icon">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        }
                                    />
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(challenge.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
