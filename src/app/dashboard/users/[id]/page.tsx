import { getUserDetails } from '@/app/actions/user-actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Calendar, Trophy, Activity } from 'lucide-react'

export default async function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const { user, habits, logs, challenges, usage } = await getUserDetails(id)

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
                    <p className="text-muted-foreground">{user.email}</p>
                </div>
                <Badge variant={(user as any).ban_duration && (user as any).ban_duration !== 'none' ? 'destructive' : 'default'}>
                    {(user as any).ban_duration && (user as any).ban_duration !== 'none' ? 'Banned' : 'Active'}
                </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Habits</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{habits.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Joined Challenges</CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{challenges.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Last Active</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'N/A'}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">ID</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xs font-mono text-muted-foreground truncate" title={user.id}>
                            {user.id}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Habits</CardTitle>
                        <CardDescription>Current habits being tracked.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Habit</TableHead>
                                    <TableHead>Streak</TableHead>
                                    <TableHead className="text-right">Completed</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {habits.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-muted-foreground">No habits found.</TableCell>
                                    </TableRow>
                                ) : (
                                    habits.map((habit: any) => (
                                        <TableRow key={habit.id}>
                                            <TableCell className="font-medium flex items-center gap-2">
                                                <span>{habit.icon || '⭐'}</span> {habit.title}
                                            </TableCell>
                                            <TableCell>{habit.streak} days</TableCell>
                                            <TableCell className="text-right">
                                                {habit.completed ? (
                                                    <CheckCircle className="h-4 w-4 text-green-500 inline" />
                                                ) : (
                                                    <XCircle className="h-4 w-4 text-muted-foreground inline" />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Last 20 completions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Habit</TableHead>
                                    <TableHead className="text-right">Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center text-muted-foreground">No activity logs found.</TableCell>
                                    </TableRow>
                                ) : (
                                    logs.map((log: any) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="font-medium">{log.habits?.title || 'Unknown Habit'}</TableCell>
                                            <TableCell className="text-right text-muted-foreground">
                                                {new Date(log.created_at).toLocaleDateString()} {new Date(log.created_at).toLocaleTimeString()}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Challenges Progress</CardTitle>
                    <CardDescription>Participation in community challenges.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Challenge</TableHead>
                                <TableHead>Progress</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Joined At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {challenges.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">No challenges joined.</TableCell>
                                </TableRow>
                            ) : (
                                challenges.map((c: any) => (
                                    <TableRow key={c.id}>
                                        <TableCell className="font-medium">{c.challenge?.title || c.challenge_id}</TableCell>
                                        <TableCell>
                                            {c.progress}%
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={c.completed ? 'default' : 'outline'}>
                                                {c.completed ? 'Completed' : 'In Progress'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right text-muted-foreground">
                                            {c.joined_at ? new Date(c.joined_at).toLocaleDateString() : '-'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
