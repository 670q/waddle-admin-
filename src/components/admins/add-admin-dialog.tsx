'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, Plus, Search, UserPlus } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface User {
    id: string
    email: string
}

interface AddAdminDialogProps {
    onSuccess?: () => void
}

export function AddAdminDialog({ onSuccess }: AddAdminDialogProps) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [searchResults, setSearchResults] = useState<User[]>([])
    const [searching, setSearching] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [role, setRole] = useState('support')
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const handleSearch = async () => {
        if (!search) return
        setSearching(true)
        const { data, error } = await supabase.rpc('get_users_for_admin', {
            search_term: search,
            page_number: 1,
            page_size: 5
        })
        if (data) {
            setSearchResults(data as User[])
        }
        setSearching(false)
    }

    const handleAddAdmin = async () => {
        if (!selectedUser) return
        setLoading(true)
        const { error } = await supabase.rpc('add_admin_role', {
            target_user_id: selectedUser.id,
            target_role: role
        })

        if (error) {
            alert('Failed to add admin')
            console.error(error)
        } else {
            setOpen(false)
            onSuccess?.()
            setSearch('')
            setSearchResults([])
            setSelectedUser(null)
        }
        setLoading(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Admin
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Admin</DialogTitle>
                    <DialogDescription>
                        Search for an existing user to promote them to an admin role.
                    </DialogDescription>
                </DialogHeader>

                {!selectedUser ? (
                    <div className="space-y-4 pt-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Search by email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <Button variant="secondary" onClick={handleSearch} disabled={searching}>
                                {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {searchResults.map(user => (
                                <div key={user.id} className="flex items-center justify-between p-2 border rounded hover:bg-muted">
                                    <span className="text-sm font-medium">{user.email}</span>
                                    <Button size="sm" variant="ghost" onClick={() => setSelectedUser(user)}>
                                        Select
                                    </Button>
                                </div>
                            ))}
                            {searchResults.length === 0 && search && !searching && (
                                <p className="text-center text-sm text-muted-foreground p-2">No users found.</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 pt-4">
                        <div className="p-4 border rounded bg-muted/50">
                            <p className="text-sm font-medium">Selected User</p>
                            <p className="text-lg">{selectedUser.email}</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Assign Role</label>
                            <Select value={role} onValueChange={setRole}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="support">Support (View Users)</SelectItem>
                                    <SelectItem value="super_admin">Super Admin (Full Access)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="ghost" onClick={() => setSelectedUser(null)}>Back</Button>
                            <Button onClick={handleAddAdmin} disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Confirm Promotion
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
