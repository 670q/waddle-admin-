import { AdminsTable } from '@/components/admins/admins-table'

export default function AdminsPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Employee Management</h1>
            </div>
            <AdminsTable />
        </div>
    )
}
