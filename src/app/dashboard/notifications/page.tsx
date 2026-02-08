import { getAnnouncementsAdmin } from '@/app/actions/notification-actions'
import { NotificationDialog } from '@/components/notifications/notification-dialog'
import { NotificationsTable } from '@/components/notifications/notifications-table'

export default async function NotificationsPage() {
    const announcements = await getAnnouncementsAdmin()

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Notifications center</h1>
                <NotificationDialog />
            </div>

            <NotificationsTable announcements={announcements} />
        </div>
    )
}
