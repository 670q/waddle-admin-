import { getPlansAdmin } from '@/app/actions/plan-actions'
import { PlansTable } from '@/components/plans/plans-table'
import { PlanDialog } from '@/components/plans/plan-dialog'

export default async function PlansPage() {
    const plans = await getPlansAdmin()

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Plans & Pricing</h1>
                    <p className="text-muted-foreground">Manage subscription tiers and AI limits.</p>
                </div>
                <PlanDialog />
            </div>

            <PlansTable plans={plans} />
        </div>
    )
}
