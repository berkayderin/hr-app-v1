// app/panel/english-test/results/components/datatable.jsx
'use client'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { useState, useCallback, useEffect } from 'react'
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'

function useDebounce(value, delay) {
	const [debouncedValue, setDebouncedValue] = useState(value)

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value)
		}, delay)

		return () => {
			clearTimeout(handler)
		}
	}, [value, delay])

	return debouncedValue
}

export function DataTable({ columns, data }) {
	const [sorting, setSorting] = useState([])
	const [globalFilter, setGlobalFilter] = useState('')
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	})

	const debouncedGlobalFilter = useDebounce(globalFilter, 200)

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onGlobalFilterChange: setGlobalFilter,
		globalFilterFn: 'includesString',
		onPaginationChange: setPagination,
		state: {
			sorting,
			globalFilter: debouncedGlobalFilter,
			pagination
		}
	})

	const handleFilter = useCallback(
		(event) => {
			setGlobalFilter(event.target.value)
		},
		[setGlobalFilter]
	)

	return (
		<div>
			<div className="flex items-center mb-2">
				<Input
					placeholder="E-posta yazın..."
					value={globalFilter ?? ''}
					onChange={handleFilter}
					className="max-w-[250px]"
				/>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder ? null : (
												<div
													{...{
														className: header.column.getCanSort()
															? 'cursor-pointer select-none'
															: '',
														onClick:
															header.column.getToggleSortingHandler()
													}}
												>
													{header.column.id === 'score' ? (
														<Button variant="ghost" size="sm">
															{flexRender(
																header.column.columnDef.header,
																header.getContext()
															)}
															{header.column.getCanSort() && (
																<span className="ml-2">
																	{header.column.getIsSorted() ===
																	'desc' ? (
																		<ArrowDown className="h-4 w-4" />
																	) : header.column.getIsSorted() ===
																	  'asc' ? (
																		<ArrowUp className="h-4 w-4" />
																	) : (
																		<ArrowUpDown className="h-4 w-4" />
																	)}
																</span>
															)}
														</Button>
													) : (
														<>
															{flexRender(
																header.column.columnDef.header,
																header.getContext()
															)}
															{header.column.getCanSort() && (
																<span className="ml-2">
																	{header.column.getIsSorted() ===
																	'desc' ? (
																		<ArrowDown className="h-4 w-4" />
																	) : header.column.getIsSorted() ===
																	  'asc' ? (
																		<ArrowUp className="h-4 w-4" />
																	) : (
																		<ArrowUpDown className="h-4 w-4" />
																	)}
																</span>
															)}
														</>
													)}
												</div>
											)}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
								>
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
									colSpan={columns.length}
									className="h-24 text-center"
								>
									Sonuç bulunamadı.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-between space-x-2 py-4">
				<div className="flex items-center space-x-2">
					<Select
						value={pagination.pageSize.toString()}
						onValueChange={(value) => {
							table.setPageSize(Number(value))
						}}
					>
						<SelectTrigger className="h-8 w-[70px]">
							<SelectValue placeholder={pagination.pageSize} />
						</SelectTrigger>
						<SelectContent side="top">
							{[10, 20, 30, 40, 50].map((pageSize) => (
								<SelectItem key={pageSize} value={`${pageSize}`}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex items-center space-x-2">
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
		</div>
	)
}
