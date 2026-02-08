'use client'

import { useState } from 'react'
import { AppConfig, updateAppConfig, createAppConfig, deleteAppConfig } from '@/app/actions/settings-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Loader2, Plus, Save, Trash2, X } from 'lucide-react'
// import { useToast } from '@/components/ui/use-toast'

interface SettingsFormProps {
    config: AppConfig[]
}

export function SettingsForm({ config: initialConfig }: SettingsFormProps) {
    const [config, setConfig] = useState(initialConfig)
    const [loading, setLoading] = useState<string | null>(null)
    const [newKey, setNewKey] = useState('')
    const [newValue, setNewValue] = useState('')
    const [isAdding, setIsAdding] = useState(false)
    // const { toast } = useToast()

    // State for editing existing values
    const [editingValues, setEditingValues] = useState<Record<string, string>>({})

    const handleUpdate = async (key: string) => {
        const value = editingValues[key]
        if (value === undefined) return // No change

        setLoading(key)
        try {
            await updateAppConfig(key, value)
            setConfig(prev => prev.map(item => item.key === key ? { ...item, value } : item))
            setEditingValues(prev => {
                const next = { ...prev }
                delete next[key]
                return next
            })
            alert("Configuration updated successfully")
        } catch (error) {
            alert("Failed to update configuration")
        } finally {
            setLoading(null)
        }
    }

    const handleCreate = async () => {
        if (!newKey || !newValue) return

        setLoading('new')
        try {
            await createAppConfig(newKey, newValue)
            setConfig(prev => [...prev, { key: newKey, value: newValue }].sort((a, b) => a.key.localeCompare(b.key)))
            setNewKey('')
            setNewValue('')
            setIsAdding(false)
            alert("Configuration created successfully")
        } catch (error) {
            alert("Failed to create configuration")
        } finally {
            setLoading(null)
        }
    }

    const handleDelete = async (key: string) => {
        if (!confirm('Are you sure you want to delete this configuration?')) return

        setLoading(key)
        try {
            await deleteAppConfig(key)
            setConfig(prev => prev.filter(item => item.key !== key))
            alert("Configuration deleted successfully")
        } catch (error) {
            alert("Failed to delete configuration")
        } finally {
            setLoading(null)
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Global Configuration</CardTitle>
                    <CardDescription>Manage application-wide settings and feature flags.</CardDescription>
                </div>
                <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
                    <Plus className="mr-2 h-4 w-4" /> Add Config
                </Button>
            </CardHeader>
            <CardContent>
                {isAdding && (
                    <div className="flex items-center gap-4 mb-4 p-4 border rounded-md bg-muted/50">
                        <Input
                            placeholder="Key (e.g. maintenance_mode)"
                            value={newKey}
                            onChange={(e) => setNewKey(e.target.value)}
                            className="font-mono text-sm"
                        />
                        <Input
                            placeholder="Value"
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                        />
                        <div className="flex gap-2">
                            <Button size="icon" onClick={handleCreate} disabled={loading === 'new'}>
                                {loading === 'new' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => setIsAdding(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[300px]">Key</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead className="w-[100px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {config.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                                    No configuration keys found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            config.map((item) => (
                                <TableRow key={item.key}>
                                    <TableCell className="font-mono text-sm font-medium">
                                        {item.key}
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            value={editingValues[item.key] ?? item.value}
                                            onChange={(e) => setEditingValues(prev => ({ ...prev, [item.key]: e.target.value }))}
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {editingValues[item.key] !== undefined && editingValues[item.key] !== item.value && (
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleUpdate(item.key)}
                                                    disabled={loading === item.key}
                                                >
                                                    {loading === item.key ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 text-primary" />}
                                                </Button>
                                            )}
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => handleDelete(item.key)}
                                                disabled={loading === item.key}
                                            >
                                                {loading === item.key ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-destructive" />}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
