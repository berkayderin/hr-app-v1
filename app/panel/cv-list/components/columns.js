// app/panel/cv-list/components/columns.js
'use client'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'
import { Eye, MoreHorizontal } from 'lucide-react'

export const createColumns = (handleViewDetails) => [
	{
		accessorFn: (row) => row.cvData.fullName,
		header: 'Ad Soyad',
		cell: ({ row }) => (
			<div className="font-medium">
				{row.original.cvData.fullName}
			</div>
		),
		id: 'cvData.fullName'
	},
	{
		accessorFn: (row) => row.cvData.email,
		header: 'E-posta',
		cell: ({ row }) => <div>{row.original.cvData.email}</div>,
		id: 'cvData.email'
	},
	{
		accessorFn: (row) => row.cvData.phone,
		header: 'Telefon',
		cell: ({ row }) => <div>{row.original.cvData.phone}</div>,
		id: 'cvData.phone'
	},
	{
		accessorFn: (row) => row.createdAt,
		header: 'Değerlendirme Tarihi',
		cell: ({ row }) => (
			<div>
				{format(new Date(row.original.createdAt), 'dd.MM.yyyy HH:mm')}
			</div>
		),
		id: 'createdAt'
	},
	{
		accessorFn: (row) => row.evaluation.generalFeedback,
		header: 'Genel Değerlendirme',
		cell: ({ row }) => (
			<div className="max-w-[500px] truncate">
				{row.original.evaluation.generalFeedback}
			</div>
		),
		id: 'evaluation.generalFeedback'
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const cv = row.original

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon">
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => handleViewDetails(cv)}>
							Detayları Görüntüle
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		}
	}
]
