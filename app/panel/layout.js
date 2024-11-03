'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
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
	Brain,
	BrainCog,
	ChevronDown,
	ChevronRight,
	ClipboardList,
	FileText,
	Home,
	LogOut,
	Menu,
	PenTool,
	User,
	Users
} from 'lucide-react'
import { signOut } from 'next-auth/react'

const allSidebarItems = [
	{
		icon: Home,
		label: 'Ana Sayfa',
		href: '/panel',
		roles: ['user', 'admin']
	},
	{
		icon: Users,
		label: 'Kullanıcı Yönetimi',
		href: '/panel/users',
		roles: ['admin']
	},
	{
		icon: ClipboardList,
		label: 'İngilizce Testleri',
		href: '/panel/english-test',
		roles: ['admin'],
		subItems: [
			{
				icon: BookOpen,
				label: 'Testleri Görüntüle',
				href: '/panel/english-test',
				roles: ['admin']
			},
			{
				icon: PenTool,
				label: 'Test Oluştur',
				href: '/panel/english-test/create',
				roles: ['admin']
			},
			{
				icon: BarChart,
				label: 'Test Sonuçları',
				href: '/panel/english-test/results',
				roles: ['admin']
			}
		]
	},
	{
		icon: Brain,
		label: 'Yetenek ve Kişilik Testleri',
		href: '/panel/skill-personality-test',
		roles: ['admin'],
		subItems: [
			{
				icon: BookOpen,
				label: 'Testleri Görüntüle',
				href: '/panel/skill-personality-test',
				roles: ['admin']
			},
			{
				icon: PenTool,
				label: 'Test Oluştur',
				href: '/panel/skill-personality-test/create',
				roles: ['admin']
			},
			{
				icon: BarChart,
				label: 'Test Sonuçları',
				href: '/panel/skill-personality-test/results',
				roles: ['admin']
			}
		]
	},
	{
		icon: Brain,
		label: 'Simülasyon Sonuçları',
		href: '/panel/simulations',
		roles: ['admin']
	},
	{
		icon: FileText,
		label: 'CV Değerlendirmeleri',
		href: '/panel/cv-list',
		roles: ['admin']
	},
	{
		icon: User,
		label: 'Hesap Ayarları',
		href: '/panel/account',
		roles: ['user', 'admin']
	}
]

export default function PanelLayout({ children }) {
	const [open, setOpen] = useState(false)
	const pathname = usePathname()
	const { data: session, status } = useSession()
	const [sidebarItems, setSidebarItems] = useState([])

	useEffect(() => {
		if (status === 'authenticated' && session?.user?.role) {
			const userRole = session.user.role
			const filteredItems = allSidebarItems
				.filter((item) => item.roles.includes(userRole))
				.map((item) => ({
					...item,
					subItems: item.subItems?.filter((subItem) =>
						subItem.roles.includes(userRole)
					)
				}))
			setSidebarItems(filteredItems)
		}
	}, [status, session])

	if (
		pathname.includes('/panel/english-test/take/') ||
		pathname.includes('/panel/skill-personality-test/take/') ||
		pathname.includes('/panel/product-owner-simulation/')
	) {
		return children
	}

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
						<span className="sr-only">Toggle menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="w-[250px] p-0">
					<Sidebar isMobile setOpen={setOpen} items={sidebarItems} />
				</SheetContent>
			</Sheet>
			<aside className="hidden w-[250px] flex-col border-r border-rose-200 bg-white lg:flex">
				<Sidebar items={sidebarItems} />
			</aside>
			<main className="flex-1 overflow-y-auto p-8">{children}</main>
		</div>
	)
}

function SidebarItem({ item, onClick, isNested = false }) {
	const [isOpen, setIsOpen] = useState(false)
	const pathname = usePathname()
	const active =
		pathname === item.href ||
		item.subItems?.some((subItem) => pathname === subItem.href)

	if (item.subItems) {
		return (
			<Collapsible open={isOpen} onOpenChange={setIsOpen}>
				<CollapsibleTrigger asChild>
					<Button
						variant="ghost"
						className={cn(
							'w-full justify-between',
							active
								? 'bg-rose-100 text-rose-700'
								: 'text-gray-600 hover:bg-rose-50 hover:text-rose-600',
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
				'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-rose-50 hover:text-rose-600',
				active ? 'bg-rose-100 text-rose-700' : 'text-gray-600',
				isNested && 'pl-8'
			)}
		>
			<item.icon className="h-4 w-4" />
			{item.label}
		</Link>
	)
}

function Sidebar({ isMobile = false, setOpen, items }) {
	return (
		<div className="flex h-full flex-col">
			<div className="flex h-14 items-center border-b border-rose-200 px-4">
				<Link
					href="/"
					className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-rose-700"
				>
					EVALTALENT
				</Link>
			</div>

			<ScrollArea className="flex-1">
				<div className="space-y-1 p-2 font-medium">
					{items.map((item) => (
						<SidebarItem
							key={item.href}
							item={item}
							onClick={isMobile ? () => setOpen?.(false) : undefined}
						/>
					))}
				</div>
			</ScrollArea>

			<div className="border-t border-rose-200 p-4">
				<Button
					variant="outline"
					className="w-full justify-start text-rose-600 hover:bg-rose-50 hover:text-rose-700"
					onClick={() => signOut()}
				>
					<LogOut className="mr-2 h-4 w-4" />
					Çıkış Yap
				</Button>
			</div>
		</div>
	)
}
