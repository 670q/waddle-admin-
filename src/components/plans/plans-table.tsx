'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit } from 'lucide-react'
import { PlanDialog } from './plan-dialog'
import { Plan, togglePlanStatusAdmin } from '@/app/actions/plan-actions'
import { useRouter } from 'next/navigation'

export function PlansTable({ plans }: { plans: Plan[] }) {
    const router = useRouter()

    const handleToggleStatus = async (plan: Plan) => {
        if (!confirm(`Are you sure you want to ${plan.is_active ? 'deactivate' : 'activate'} this plan?`)) return
        try {
            await togglePlanStatusAdmin(plan.id, !plan.is_active)
            router.refresh()
        } catch (error) {
            alert('Failed to update status')
        }
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>AI Limit</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {plans.map((plan) => (
                        <TableRow key={plan.id}>
                            <TableCell className="font-medium">{plan.name}</TableCell>
                            <TableCell>
                                {plan.price === 0 ? 'Free' : `$${plan.price} / ${plan.interval}`}
                            </TableCell>
                            <TableCell>
                                {plan.ai_message_limit === -1 ? 'Unlimited' : plan.ai_message_limit} msgs
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="ghost"
                                    className="p-0 h-auto font-normal hover:bg-transparent"
                                    onClick={() => handleToggleStatus(plan)}
                                >
                                    <Badge variant={plan.is_active ? 'default' : 'destructive'}>
                                        {plan.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </Button>
                            </TableCell>
                            <TableCell className="text-right">
                                <PlanDialog
                                    plan={plan}
                                    trigger={
                                        <Button variant="ghost" size="icon">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    }
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
