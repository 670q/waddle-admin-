import { getAppConfig } from '@/app/actions/settings-actions'
import { SettingsForm } from '@/components/settings/settings-form'

export default async function SettingsPage() {
    const config = await getAppConfig()

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage global application configuration.</p>
            </div>

            <SettingsForm config={config} />
        </div>
    )
}
