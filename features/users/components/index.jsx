// features/users/components/UserList/index.jsx
'use client'

import { useState } from 'react'
import useUsers from '@/features/users/queries/useUsers'
import { toast } from 'sonner'
import {
	useReactTable,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	getFilteredRowModel
} from '@tanstack/react-table'
import { UserTable } from './UserTable'
import { UserTableSearch } from './UserTableSearch'
import { UserTablePagination } from './UserTablePagination'
import { createColumns } from './columns'

const UserList = () => {
	const [sorting, setSorting] = useState([])
	const [globalFilter, setGlobalFilter] = useState('')

	const { useFetchUsers, useUpdateUserRole, useDeleteUser } =
		useUsers()
	const { data: users = [], isLoading, error } = useFetchUsers()
	const updateUserRole = useUpdateUserRole()
	const deleteUser = useDeleteUser()

	const handleRoleChange = async (userId, newRole) => {
		try {
			await updateUserRole.mutateAsync({ userId, newRole })
			toast.success('Kullanıcı rolü güncellendi.')
		} catch (error) {
			toast.error('Kullanıcı rolü güncellenirken bir hata oluştu.')
		}
	}

	const handleDeleteUser = async (userId) => {
		if (!confirm('Kullanıcıyı silmek istediğinize emin misiniz?'))
			return
		try {
			await deleteUser.mutateAsync(userId)
			toast.success('Kullanıcı silindi.')
		} catch (error) {
			toast.error('Kullanıcı silinirken bir hata oluştu.')
		}
	}

	const columns = createColumns({
		onRoleChange: handleRoleChange,
		onDeleteUser: handleDeleteUser
	})

	const table = useReactTable({
		data: users,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			globalFilter
		},
		onSortingChange: setSorting,
		onGlobalFilterChange: setGlobalFilter,
		enableSorting: true
	})

	if (isLoading) return <div>Kullanıcılar yükleniyor...</div>
	if (error) return <div>Hata: {error.message}</div>

	return (
		<div className="space-y-4">
			<UserTableSearch
				globalFilter={globalFilter}
				onGlobalFilterChange={setGlobalFilter}
			/>

			<UserTable table={table} columns={columns} />

			<UserTablePagination table={table} />
		</div>
	)
}

export default UserList
