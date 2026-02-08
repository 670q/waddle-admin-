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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Loader2, Search, Ban, CheckCircle, Eye } from 'lucide-react'
import Link from 'next/link'
import { getUsersAdmin, banUserAdmin, unbanUserAdmin } from '@/app/actions/user-actions'
import { useDebounce } from '@/hooks/use-debounce'

interface User {
    id: string
    email: string
    created_at: string
    last_sign_in_at: string | null
    is_banned: boolean
}

export function UsersTable() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [page] = useState(1)

    const debouncedSearch = useDebounce(search, 500)

    const fetchUsers = useCallback(async () => {
        setLoading(true)
        try {
            const { users } = await getUsersAdmin(debouncedSearch, page, 20)
            setUsers(users as User[])
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setLoading(false)
        }
    }, [debouncedSearch, page])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    const toggleBan = async (userId: string, isBanned: boolean) => {
        if (!confirm(isBanned ? 'Unban user?' : 'Are you sure you want to ban this user?')) return

        try {
            if (isBanned) {
                await unbanUserAdmin(userId)
            } else {
                await banUserAdmin(userId)
            }
            fetchUsers() // Refresh list
        } catch (error) {
            console.error('Error toggling ban:', error)
            alert('Failed to update user status')
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead>Last Login</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>{user.email?.slice(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{user.email}</span>
                                            <span className="text-xs text-muted-foreground">{user.id}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {user.is_banned ? (
                                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80">
                                                Banned
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-500 text-white hover:bg-green-600">
                                                Active
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/dashboard/users/${user.id}`}>
                                                <Eye className="mr-2 h-4 w-4" /> Details
                                            </Link>
                                        </Button>

                                        <Button
                                            variant={user.is_banned ? "outline" : "destructive"}
                                            size="sm"
                                            onClick={() => toggleBan(user.id, user.is_banned)}
                                        >
                                            {user.is_banned ? (
                                                <>
                                                    <CheckCircle className="mr-2 h-4 w-4" /> Unban
                                                </>
                                            ) : (
                                                <>
                                                    <Ban className="mr-2 h-4 w-4" /> Ban
                                                </>
                                            )}
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
