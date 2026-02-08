import { ChallengesTable } from '@/components/challenges/challenges-table'
import { ChallengeDialog } from '@/components/challenges/challenge-dialog'

export default function ChallengesPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Challenges</h1>
                <ChallengeDialog />
            </div>
            <ChallengesTable />
        </div>
    )
}
