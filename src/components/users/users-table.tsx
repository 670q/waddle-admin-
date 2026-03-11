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
import { Loader2, Search, Ban, CheckCircle, Eye, Crown } from 'lucide-react'
import Link from 'next/link'
import { EmailUserDialog } from '@/components/users/email-user-dialog'
import { BulkEmailDialog } from '@/components/users/bulk-email-dialog'
import { getUsersAdmin, banUserAdmin, unbanUserAdmin, toggleProAdmin, getProStatusBatch } from '@/app/actions/user-actions'
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
    const [proMap, setProMap] = useState<Record<string, boolean>>({})
    const [togglingPro, setTogglingPro] = useState<string | null>(null)

    const debouncedSearch = useDebounce(search, 500)

    const fetchUsers = useCallback(async () => {
        setLoading(true)
        try {
            const { users } = await getUsersAdmin(debouncedSearch, page, 20)
            setUsers(users as User[])

            // Fetch Pro status for all users in batch
            const ids = (users as User[]).map(u => u.id)
            if (ids.length > 0) {
                const proStatus = await getProStatusBatch(ids)
                setProMap(proStatus)
            }
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

    const handleTogglePro = async (userId: string) => {
        const currentPro = proMap[userId] ?? false
        const newPro = !currentPro

        // Optimistic update
        setProMap(prev => ({ ...prev, [userId]: newPro }))
        setTogglingPro(userId)

        try {
            await toggleProAdmin(userId, newPro)
        } catch (error) {
            // Revert on failure
            setProMap(prev => ({ ...prev, [userId]: currentPro }))
            console.error('Error toggling pro:', error)
            alert('Failed to update Pro status')
        } finally {
            setTogglingPro(null)
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
                <div className="ml-auto">
                    <BulkEmailDialog search={debouncedSearch} totalUsersText={loading ? '...' : String(users.length)} />
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead>Last Login</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => {
                                const isPro = proMap[user.id] ?? false
                                return (
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
                                            <button
                                                onClick={() => handleTogglePro(user.id)}
                                                disabled={togglingPro === user.id}
                                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${isPro
                                                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 shadow-sm hover:from-amber-500 hover:to-yellow-600'
                                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                                                    }`}
                                            >
                                                {togglingPro === user.id ? (
                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                ) : (
                                                    <Crown className="h-3 w-3" />
                                                )}
                                                {isPro ? 'Pro' : 'Free'}
                                            </button>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
                                        </TableCell>
                                        <TableCell className="text-right flex items-center justify-end gap-2">
                                            <EmailUserDialog userId={user.id} email={user.email} />
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
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
