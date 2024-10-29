// features/users/components/UserList/UserTablePagination.jsx
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function UserTablePagination({ table }) {
	const currentPage = table.getState().pagination.pageIndex + 1
	const totalPages = table.getPageCount()
	const totalRecords = table.getFilteredRowModel().rows.length
	const pageSize = table.getState().pagination.pageSize
	const rangeStart = (currentPage - 1) * pageSize + 1
	const rangeEnd = Math.min(currentPage * pageSize, totalRecords)

	return (
		<div className="flex items-center justify-between gap-6">
			<span className="text-sm text-muted-foreground">
				{totalRecords} kayıttan {rangeStart}-{rangeEnd} arası
			</span>

			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					className="hidden h-8 w-8 p-0 sm:flex"
					onClick={() => table.setPageIndex(0)}
					disabled={!table.getCanPreviousPage()}
				>
					<span className="sr-only">İlk sayfa</span>
					<ChevronLeft className="h-4 w-4" />
					<ChevronLeft className="h-4 w-4 -ml-2" />
				</Button>

				<Button
					variant="outline"
					size="sm"
					className="h-8 w-8 p-0"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					<span className="sr-only">Önceki sayfa</span>
					<ChevronLeft className="h-4 w-4" />
				</Button>

				<span className="min-w-[100px] text-center text-sm font-medium">
					Sayfa {currentPage} / {totalPages || 1}
				</span>

				<Button
					variant="outline"
					size="sm"
					className="h-8 w-8 p-0"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					<span className="sr-only">Sonraki sayfa</span>
					<ChevronRight className="h-4 w-4" />
				</Button>

				<Button
					variant="outline"
					size="sm"
					className="hidden h-8 w-8 p-0 sm:flex"
					onClick={() => table.setPageIndex(totalPages - 1)}
					disabled={!table.getCanNextPage()}
				>
					<span className="sr-only">Son sayfa</span>
					<ChevronRight className="h-4 w-4" />
					<ChevronRight className="h-4 w-4 -ml-2" />
				</Button>
			</div>
		</div>
	)
}
