'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Loader2, Trash2, Shield, ShieldAlert } from 'lucide-react'
import { AddAdminDialog } from './add-admin-dialog'

export function AdminsTable() {
    const [admins, setAdmins] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    const fetchAdmins = useCallback(async () => {
        setLoading(true)
        const { data, error } = await supabase.rpc('get_admins')

        if (error) {
            console.error(error)
        } else {
            setAdmins(data || [])
        }
        setLoading(false)
    }, [supabase])

    useEffect(() => {
        fetchAdmins()
    }, [fetchAdmins])

    const handleRemove = async (id: string) => {
        if (!confirm('Are you sure you want to remove this admin?')) return

        const { error } = await supabase.rpc('remove_admin_role', { target_user_id: id })

        if (error) {
            alert('Failed to remove admin')
        } else {
            fetchAdmins()
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <AddAdminDialog onSuccess={fetchAdmins} />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                                </TableCell>
                            </TableRow>
                        ) : admins.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No admins found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            admins.map((admin) => (
                                <TableRow key={admin.id}>
                                    <TableCell className="font-medium">{admin.email}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {admin.role === 'super_admin' ? (
                                                <ShieldAlert className="h-4 w-4 text-red-500" />
                                            ) : (
                                                <Shield className="h-4 w-4 text-blue-500" />
                                            )}
                                            <span className="capitalize">{admin.role.replace('_', ' ')}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(admin.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleRemove(admin.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
