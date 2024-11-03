// app/panel/cv-list/components/columns.js
'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'
import { Eye, MoreHorizontal, Trash2 } from 'lucide-react'
import { useState } from 'react'

export const createColumns = (handleViewDetails, handleDelete) => [
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
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const [showDeleteDialog, setShowDeleteDialog] = useState(false)

			return (
				<>
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
							<DropdownMenuItem
								onClick={() => setShowDeleteDialog(true)}
								className="text-destructive focus:text-destructive"
							>
								Sil
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<Dialog
						open={showDeleteDialog}
						onOpenChange={setShowDeleteDialog}
					>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>CV'yi Sil</DialogTitle>
								<DialogDescription>
									Bu CV'yi silmek istediğinizden emin misiniz? Bu
									işlem geri alınamaz.
								</DialogDescription>
							</DialogHeader>
							<DialogFooter className="gap-2 sm:gap-0">
								<Button
									variant="outline"
									onClick={() => setShowDeleteDialog(false)}
								>
									İptal
								</Button>
								<Button
									variant="destructive"
									onClick={() => {
										handleDelete(cv.id)
										setShowDeleteDialog(false)
									}}
								>
									Sil
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</>
			)
		}
	}
]
