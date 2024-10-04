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
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import {
	BarChart,
	BookOpen,
	ChevronDown,
	ChevronRight,
	ClipboardList,
	Home,
	LogOut,
	Menu,
	Package2,
	PenTool,
	Settings,
	User,
	Users
} from 'lucide-react'

const sidebarItems = [
	{ icon: Home, label: 'Ana Sayfa', href: '/panel' },
	{ icon: User, label: 'Hesap Ayarları', href: '/panel/account' },
	{ icon: Users, label: 'Kullanıcı Yönetimi', href: '/panel/users' },
	{
		icon: ClipboardList,
		label: 'İngilizce Testleri',
		href: '/panel/english-test',
		subItems: [
			{
				icon: BookOpen,
				label: 'Testleri Görüntüle',
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
			}
		]
	}
	// { icon: Settings, label: 'Ayarlar', href: '/panel/settings' }
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
				<SheetContent
					side="left"
					className="w-[240px] p-0 bg-white dark:bg-gray-950"
				>
					<MobileSidebar pathname={pathname} setOpen={setOpen} />
				</SheetContent>
			</Sheet>
			<aside className="hidden w-[240px] flex-col border-r lg:flex bg-white dark:bg-gray-950">
				<DesktopSidebar pathname={pathname} />
			</aside>
			<main className="flex-1 overflow-y-auto p-8">{children}</main>
		</div>
	)
}

function SidebarItem({ item, pathname, onClick, isNested = false }) {
	const [isOpen, setIsOpen] = useState(false)
	const active =
		pathname === item.href ||
		(item.subItems &&
			item.subItems.some((subItem) => pathname === subItem.href))

	if (item.subItems) {
		return (
			<Collapsible open={isOpen} onOpenChange={setIsOpen}>
				<CollapsibleTrigger asChild>
					<Button
						variant="ghost"
						className={cn(
							'w-full justify-between',
							active
								? 'bg-muted text-primary'
								: 'text-muted-foreground',
							isNested && 'pl-8'
						)}
					>
						<span className="flex items-center">
							<item.icon className="mr-2 h-4 w-4" />
							{item.label}
						</span>
						{isOpen ? (
							<ChevronDown className="h-4 w-4" />
						) : (
							<ChevronRight className="h-4 w-4" />
						)}
					</Button>
				</CollapsibleTrigger>
				<CollapsibleContent className="space-y-1 mt-1">
					{item.subItems.map((subItem) => (
						<SidebarItem
							key={subItem.href}
							item={subItem}
							pathname={pathname}
							onClick={onClick}
							isNested
						/>
					))}
				</CollapsibleContent>
			</Collapsible>
		)
	}

	return (
		<Link
			href={item.href}
			onClick={onClick}
			className={cn(
				'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary',
				active ? 'bg-muted text-primary' : 'text-muted-foreground',
				isNested && 'pl-8'
			)}
		>
			<item.icon className="h-4 w-4" />
			{item.label}
		</Link>
	)
}

function Sidebar({ pathname, isMobile = false, setOpen }) {
	return (
		<div className="flex h-full flex-col">
			<div className="flex h-14 items-center border-b px-4">
				<Link
					href="/"
					className="flex items-center gap-2 font-semibold"
				>
					<Package2 className="h-6 w-6" />
					<span className="">HR App</span>
				</Link>
			</div>
			<ScrollArea className="flex-1">
				<div className="space-y-1 p-2">
					{sidebarItems.map((item) => (
						<SidebarItem
							key={item.href}
							item={item}
							pathname={pathname}
							onClick={isMobile ? () => setOpen(false) : undefined}
						/>
					))}
				</div>
			</ScrollArea>
			<div className="border-t p-4">
				<Button
					variant="outline"
					className="w-full justify-start"
					asChild
				>
					<Link href="/api/auth/signout">
						<LogOut className="mr-2 h-4 w-4" />
						Çıkış Yap
					</Link>
				</Button>
			</div>
		</div>
	)
}

function MobileSidebar({ pathname, setOpen }) {
	return <Sidebar pathname={pathname} isMobile setOpen={setOpen} />
}

function DesktopSidebar({ pathname }) {
	return <Sidebar pathname={pathname} />
}
