// features/users/components/UserList/UserTable.jsx
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import { flexRender } from '@tanstack/react-table'
import { ArrowUpDown, ArrowDown, ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export function UserTable({ table, columns }) {
	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<TableHead
									key={header.id}
									className={cn(
										header.column.getCanSort() &&
											'cursor-pointer select-none',
										'relative'
									)}
									onClick={
										header.column.getCanSort()
											? header.column.getToggleSortingHandler()
											: undefined
									}
								>
									<div
										className={cn(
											'flex items-center gap-2',
											header.column.getCanSort() &&
												'group hover:text-foreground'
										)}
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
											  )}

										{header.column.getCanSort() && (
											<div className="flex items-center">
												{header.column.getIsSorted() === 'desc' ? (
													<ArrowDown className="ml-1 h-4 w-4" />
												) : header.column.getIsSorted() === 'asc' ? (
													<ArrowUp className="ml-1 h-4 w-4" />
												) : (
													<ArrowUpDown className="ml-1 h-4 w-4 text-gray-400 group-hover:text-foreground transition-colors" />
												)}
											</div>
										)}

										{/* Hover durumunda alt çizgi */}
										{header.column.getCanSort() && (
											<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
										)}
									</div>
								</TableHead>
							))}
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
								Kullanıcı bulunamadı.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	)
}
