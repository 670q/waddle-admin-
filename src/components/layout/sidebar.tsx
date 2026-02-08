'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    LayoutDashboard,
    Users,
    Trophy,
    ShieldCheck,
    Settings,
    Bell,
    CreditCard,
    Hammer,

} from 'lucide-react'

const sidebarItems = [
    {
        title: 'Overview',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Users',
        href: '/dashboard/users',
        icon: Users,
    },
    {
        title: 'Challenges',
        href: '/dashboard/challenges',
        icon: Trophy,
    },
    {
        title: 'Notifications',
        href: '/dashboard/notifications',
        icon: Bell,
    },
    {
        title: 'Plans',
        href: '/dashboard/plans',
        icon: CreditCard,
    },
    {
        title: 'Admins',
        href: '/dashboard/admins',
        icon: ShieldCheck,
    },
    //   {
    //     title: 'Settings',
    //     href: '/dashboard/settings',
    //     icon: Settings,
    //   },
    {
        title: 'Settings',
        href: '/dashboard/settings',
        icon: Settings,
    },
    {
        title: 'Maintenance',
        href: '/dashboard/maintenance',
        icon: Hammer,
    },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex flex-col h-full border-r bg-card">
            <div className="h-14 flex items-center px-6 border-b">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                    <span className="text-xl">Waddle Admin</span>
                </Link>
            </div>
            <div className="flex-1 py-4">
                <nav className="grid gap-1 px-2">
                    {sidebarItems.map((item, index) => (
                        <Button
                            key={index}
                            asChild
                            variant={pathname === item.href ? 'secondary' : 'ghost'}
                            className={cn(
                                'justify-start gap-2',
                                pathname === item.href && 'bg-secondary'
                            )}
                        >
                            <Link href={item.href}>
                                <item.icon className="h-4 w-4" />
                                {item.title}
                            </Link>
                        </Button>
                    ))}
                </nav>
            </div>
        </div>
    )
}
