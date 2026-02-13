'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { sidebarItems } from './sidebar'
import { useState } from 'react'

export function MobileSidebar() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[300px] p-0">
                <div className="flex flex-col h-full bg-card">
                    <div className="h-14 flex items-center px-6 border-b">
                        <Link href="/dashboard" className="flex items-center gap-2 font-semibold" onClick={() => setOpen(false)}>
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
                                    onClick={() => setOpen(false)}
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
            </SheetContent>
        </Sheet>
    )
}
