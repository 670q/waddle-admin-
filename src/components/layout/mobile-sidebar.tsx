'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { useState } from 'react'
import { sidebarItems } from './sidebar'

export function MobileSidebar() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 sm:w-80 border-r pt-10 px-0">
                <div className="flex flex-col h-full overflow-y-auto w-full max-w-full">
                    <div className="px-6 flex items-center gap-2 font-semibold pb-4 border-b">
                        <span className="text-xl">Waddle Admin</span>
                    </div>
                    <div className="flex-1 py-4 flex flex-col items-center">
                        <nav className="grid gap-1 px-2 w-full max-w-[280px]">
                            {sidebarItems.map((item, index) => (
                                <Button
                                    key={index}
                                    asChild
                                    variant={pathname === item.href ? 'default' : 'ghost'}
                                    className={cn(
                                        'justify-start',
                                        pathname === item.href && "bg-purple-100/50 text-purple-900 font-medium"
                                    )}
                                    onClick={() => setOpen(false)}
                                >
                                    <Link href={item.href}>
                                        <item.icon className={cn(
                                            "mr-2 h-4 w-4",
                                            pathname === item.href ? "text-purple-600" : "text-muted-foreground"
                                        )} />
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
