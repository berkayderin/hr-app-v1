// app/panel/cv-list/page.js
'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
	Brain,
	Code2,
	Eye,
	FileText,
	GraduationCap,
	MoreHorizontal,
	User
} from 'lucide-react'
import { format } from 'date-fns'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger
} from '@/components/ui/tabs'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable
} from '@tanstack/react-table'
import { Input } from '@/components/ui/input'
import { createColumns } from './components/columns'

const CvListTable = () => {
	const [sorting, setSorting] = useState([])
	const [columnFilters, setColumnFilters] = useState([])
	const [columnVisibility, setColumnVisibility] = useState({})
	const [rowSelection, setRowSelection] = useState({})
	const [data, setData] = useState([])
	const [selectedCv, setSelectedCv] = useState(null)
	const [openDialog, setOpenDialog] = useState(false)

	console.log('data:', data)

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const handleViewDetails = (cv) => {
		setSelectedCv(cv)
		setOpenDialog(true)
	}

	const columns = useMemo(
		() => createColumns(handleViewDetails),
		[handleViewDetails]
	)

	useEffect(() => {
		const fetchCvList = async () => {
			try {
				const response = await fetch('/api/cv/list')
				const result = await response.json()
				setData(result)
			} catch (error) {
				console.error('CV list fetch error:', error)
			}
		}

		fetchCvList()
	}, [])

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection
		}
	})

	return (
		<div className="space-y-4">
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">
						CV Değerlendirmeleri
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center pb-4">
						<Input
							placeholder="Ad Soyad ile filtrele..."
							value={
								table
									.getColumn('cvData.fullName')
									?.getFilterValue() ?? ''
							}
							onChange={(event) =>
								table
									.getColumn('cvData.fullName')
									?.setFilterValue(event.target.value)
							}
							className="max-w-[300px]"
						/>
					</div>
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								{table.getHeaderGroups().map((headerGroup) => (
									<TableRow key={headerGroup.id}>
										{headerGroup.headers.map((header) => (
											<TableHead key={header.id}>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext()
													  )}
											</TableHead>
										))}
									</TableRow>
								))}
							</TableHeader>
							<TableBody>
								{table.getRowModel().rows?.length ? (
									table.getRowModel().rows.map((row) => (
										<TableRow key={row.id}>
											{row.getVisibleCells().map((cell) => (
												<TableCell key={cell.id}>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext()
													)}
												</TableCell>
											))}
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell
											colSpan={table.getAllColumns().length}
											className="h-24 text-center"
										>
											Kayıt bulunamadı.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
					<div className="flex items-center justify-end space-x-2 py-4">
						<div className="flex-1 text-sm text-muted-foreground">
							{table.getFilteredSelectedRowModel().rows.length} /{' '}
							{table.getFilteredRowModel().rows.length} kayıt seçildi.
						</div>
						<div className="space-x-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
							>
								Önceki
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
							>
								Sonraki
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			<Dialog open={openDialog} onOpenChange={setOpenDialog}>
				<DialogContent className="max-w-4xl max-h-[90vh]">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<FileText className="h-5 w-5" />
							CV Detayları - {selectedCv?.cvData.fullName}
						</DialogTitle>
					</DialogHeader>
					<ScrollArea className="h-[calc(90vh-100px)]">
						{selectedCv && (
							<Tabs defaultValue="personal" className="w-full">
								<TabsList className="grid w-full grid-cols-4">
									<TabsTrigger
										value="personal"
										className="flex items-center gap-2"
									>
										<User className="h-4 w-4" />
										Kişisel
									</TabsTrigger>
									<TabsTrigger
										value="experience"
										className="flex items-center gap-2"
									>
										<GraduationCap className="h-4 w-4" />
										Deneyim
									</TabsTrigger>
									<TabsTrigger
										value="skills"
										className="flex items-center gap-2"
									>
										<Code2 className="h-4 w-4" />
										Yetenekler
									</TabsTrigger>
									<TabsTrigger
										value="evaluation"
										className="flex items-center gap-2"
									>
										<Brain className="h-4 w-4" />
										Değerlendirme
									</TabsTrigger>
								</TabsList>

								<div className="p-4 space-y-6">
									<TabsContent value="personal" className="space-y-4">
										<Card>
											<CardHeader>
												<CardTitle>Kişisel Bilgiler</CardTitle>
											</CardHeader>
											<CardContent className="space-y-2">
												<div className="grid grid-cols-2 gap-4">
													<div className="space-y-1">
														<label className="text-sm font-medium">
															Ad Soyad
														</label>
														<p className="text-sm">
															{selectedCv.cvData.fullName}
														</p>
													</div>
													<div className="space-y-1">
														<label className="text-sm font-medium">
															E-posta
														</label>
														<p className="text-sm">
															{selectedCv.cvData.email}
														</p>
													</div>
													<div className="space-y-1">
														<label className="text-sm font-medium">
															Telefon
														</label>
														<p className="text-sm">
															{selectedCv.cvData.phone}
														</p>
													</div>
													<div className="space-y-1">
														<label className="text-sm font-medium">
															Adres
														</label>
														<p className="text-sm">
															{selectedCv.cvData.address}
														</p>
													</div>
												</div>
											</CardContent>
										</Card>
										<Card>
											<CardHeader>
												<CardTitle>Özet</CardTitle>
											</CardHeader>
											<CardContent>
												<p className="text-sm">
													{selectedCv.cvData.summary}
												</p>
											</CardContent>
										</Card>
									</TabsContent>

									<TabsContent
										value="experience"
										className="space-y-4"
									>
										<Card>
											<CardHeader>
												<CardTitle>Eğitim Bilgileri</CardTitle>
											</CardHeader>
											<CardContent>
												<p className="text-sm whitespace-pre-line">
													{selectedCv.cvData.education}
												</p>
											</CardContent>
										</Card>
										<Card>
											<CardHeader>
												<CardTitle>İş Deneyimi</CardTitle>
											</CardHeader>
											<CardContent>
												<p className="text-sm whitespace-pre-line">
													{selectedCv.cvData.workExperience}
												</p>
											</CardContent>
										</Card>
										<Card>
											<CardHeader>
												<CardTitle>Projeler</CardTitle>
											</CardHeader>
											<CardContent>
												<p className="text-sm whitespace-pre-line">
													{selectedCv.cvData.projects}
												</p>
											</CardContent>
										</Card>
									</TabsContent>

									<TabsContent value="skills" className="space-y-4">
										<Card>
											<CardHeader>
												<CardTitle>Yetenekler</CardTitle>
											</CardHeader>
											<CardContent>
												<p className="text-sm whitespace-pre-line">
													{selectedCv.cvData.skills}
												</p>
											</CardContent>
										</Card>
										<Card>
											<CardHeader>
												<CardTitle>Yabancı Diller</CardTitle>
											</CardHeader>
											<CardContent>
												<p className="text-sm">
													{selectedCv.cvData.languages}
												</p>
											</CardContent>
										</Card>
										<Card>
											<CardHeader>
												<CardTitle>Sertifikalar</CardTitle>
											</CardHeader>
											<CardContent>
												<p className="text-sm whitespace-pre-line">
													{selectedCv.cvData.certifications}
												</p>
											</CardContent>
										</Card>
									</TabsContent>

									<TabsContent
										value="evaluation"
										className="space-y-4"
									>
										<Card>
											<CardHeader>
												<CardTitle>Genel Değerlendirme</CardTitle>
											</CardHeader>
											<CardContent>
												<p className="text-sm">
													{selectedCv.evaluation.generalFeedback}
												</p>
											</CardContent>
										</Card>

										<div className="grid grid-cols-2 gap-4">
											<Card>
												<CardHeader>
													<CardTitle>Güçlü Yönler</CardTitle>
												</CardHeader>
												<CardContent>
													<ul className="list-disc pl-4 text-sm space-y-1">
														{selectedCv.evaluation.strengths.map(
															(strength, idx) => (
																<li key={idx}>{strength}</li>
															)
														)}
													</ul>
												</CardContent>
											</Card>

											<Card>
												<CardHeader>
													<CardTitle>
														Geliştirilmesi Gerekenler
													</CardTitle>
												</CardHeader>
												<CardContent>
													<ul className="list-disc pl-4 text-sm space-y-1">
														{selectedCv.evaluation.weaknesses.map(
															(weakness, idx) => (
																<li key={idx}>{weakness}</li>
															)
														)}
													</ul>
												</CardContent>
											</Card>
										</div>

										{selectedCv.evaluation.sections.map(
											(section, index) => (
												<Card key={index}>
													<CardHeader>
														<CardTitle>{section.title}</CardTitle>
													</CardHeader>
													<CardContent>
														<ul className="list-disc pl-4 text-sm space-y-1">
															{section.suggestions.map(
																(suggestion, idx) => (
																	<li key={idx}>{suggestion}</li>
																)
															)}
														</ul>
													</CardContent>
												</Card>
											)
										)}

										<Card>
											<CardHeader>
												<CardTitle>Sektör Trendleri</CardTitle>
											</CardHeader>
											<CardContent>
												<ul className="list-disc pl-4 text-sm space-y-1">
													{selectedCv.evaluation.industryTrends.map(
														(trend, idx) => (
															<li key={idx}>{trend}</li>
														)
													)}
												</ul>
											</CardContent>
										</Card>
									</TabsContent>
								</div>
							</Tabs>
						)}
					</ScrollArea>
				</DialogContent>
			</Dialog>
		</div>
	)
}

export default CvListTable
