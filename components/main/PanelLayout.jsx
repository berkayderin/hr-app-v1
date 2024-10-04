'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
	Sheet,
	SheetContent,
	SheetTrigger
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { Menu } from 'lucide-react'
import {
	BarChart,
	ClipboardList,
	Home,
	Package2,
	PenTool,
	Settings,
	User,
	Users
} from 'lucide-react'

const sidebarItems = [
	{ icon: Home, label: 'Ana Sayfa', href: '/panel' },
	{ icon: User, label: 'Hesap Bilgilerim', href: '/panel/account' },
	{ icon: Users, label: 'Kullanıcı Yönetimi', href: '/panel/users' },
	{
		icon: ClipboardList,
		label: 'İngilizce Testleri',
		href: '/panel/english-test'
	},
	{
		icon: PenTool,
		label: 'Test Oluştur',
		href: '/panel/english-test/create'
	},
	{
		icon: BarChart,
		label: 'Test Sonuçları',
		href: '/panel/english-test/results'
	},
	{ icon: Settings, label: 'Ayarlar', href: '/panel/settings' }
]

export default function PanelLayout({ children }) {
	const [open, setOpen] = useState(false)
	const pathname = usePathname()

	return (
		<div className="flex min-h-screen bg-background">
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<Button
						variant="outline"
						size="icon"
						className="fixed left-4 top-4 z-40 lg:hidden"
					>
						<Menu className="h-4 w-4" />
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="w-[240px] p-0">
					<MobileSidebar pathname={pathname} setOpen={setOpen} />
				</SheetContent>
			</Sheet>
			<aside className="hidden w-[240px] flex-col lg:flex">
				<DesktopSidebar pathname={pathname} />
			</aside>
			<main className="flex-1 overflow-y-auto p-8">{children}</main>
		</div>
	)
}

function MobileSidebar({ pathname, setOpen }) {
	return (
		<div className="flex h-full flex-col">
			<div className="flex h-14 items-center border-b px-4">
				<Link
					href="/"
					className="flex items-center gap-2 font-semibold"
				>
					<Package2 className="h-6 w-6" />
					<span className="">Acme Inc</span>
				</Link>
			</div>
			<ScrollArea className="flex-1">
				<div className="space-y-1 p-2">
					{sidebarItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							onClick={() => setOpen(false)}
							className={cn(
								'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary',
								pathname === item.href
									? 'bg-muted text-primary'
									: 'text-muted-foreground'
							)}
						>
							<item.icon className="h-4 w-4" />
							{item.label}
						</Link>
					))}
				</div>
			</ScrollArea>
		</div>
	)
}

function DesktopSidebar({ pathname }) {
	return (
		<div className="flex h-full flex-col">
			<div className="flex h-14 items-center border-b px-4">
				<Link
					href="/"
					className="flex items-center gap-2 font-semibold"
				>
					<Package2 className="h-6 w-6" />
					<span className="">Acme Inc</span>
				</Link>
			</div>
			<ScrollArea className="flex-1">
				<div className="space-y-1 p-2">
					{sidebarItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary',
								pathname === item.href
									? 'bg-muted text-primary'
									: 'text-muted-foreground'
							)}
						>
							<item.icon className="h-4 w-4" />
							{item.label}
						</Link>
					))}
				</div>
			</ScrollArea>
		</div>
	)
}
