import { getAppConfig } from '@/app/actions/settings-actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Hammer, Sparkles, CheckCircle } from 'lucide-react'
import { ToggleForm } from '@/components/maintenance/toggle-form'
import { AutoChallengeForm } from '@/components/maintenance/auto-challenge-form'

export default async function MaintenancePage() {
    const config = await getAppConfig()

    const maintenanceMode = config.find(c => c.key === 'maintenance_mode')?.value === 'true'
    const autoChallengeEnabled = config.find(c => c.key === 'auto_challenge_enabled')?.value === 'true'
    const autoChallengeInterval = config.find(c => c.key === 'auto_challenge_interval_hours')?.value || '24'
    const autoChallengeType = config.find(c => c.key === 'auto_challenge_type')?.value || 'both'
    const autoChallengeLastRun = config.find(c => c.key === 'auto_challenge_last_run')?.value || null

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">System Management</h1>
                <p className="text-muted-foreground">Manage maintenance mode and automated features.</p>
            </div>

            {/* Maintenance Mode Card */}
            <Card className={maintenanceMode ? "border-destructive/50 bg-destructive/5" : ""}>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Hammer className={maintenanceMode ? "h-6 w-6 text-destructive" : "h-6 w-6 text-muted-foreground"} />
                        <CardTitle>Maintenance Mode</CardTitle>
                    </div>
                    <CardDescription>
                        Turn maintenance mode on or off. When enabled, users will see a maintenance screen.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            {maintenanceMode ? (
                                <>
                                    <AlertTriangle className="h-5 w-5 text-destructive" />
                                    <div>
                                        <p className="font-medium">System is in Maintenance Mode</p>
                                        <p className="text-sm text-muted-foreground">The application is currently inaccessible to regular users.</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <div>
                                        <p className="font-medium">System is Active</p>
                                        <p className="text-sm text-muted-foreground">The application is running normally.</p>
                                    </div>
                                </>
                            )}
                        </div>
                        <ToggleForm initialState={maintenanceMode} />
                    </div>
                </CardContent>
            </Card>

            {/* Auto Challenge Generation Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-purple-500" />
                        <CardTitle>Auto Challenge Generation</CardTitle>
                    </div>
                    <CardDescription>
                        Automatically generate new challenges using AI on a schedule.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AutoChallengeForm
                        initialEnabled={autoChallengeEnabled}
                        initialInterval={autoChallengeInterval}
                        initialType={autoChallengeType}
                        lastRun={autoChallengeLastRun}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
