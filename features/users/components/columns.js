// features/users/components/UserList/columns.js
import { Badge } from '@/components/ui/badge'
import { UserTableActions } from './UserTableActions'

export const createColumns = ({ onRoleChange, onDeleteUser }) => [
	{
		accessorKey: 'email',
		header: 'E-posta',
		cell: ({ row }) => <div>{row.original.email}</div>,
		enableSorting: true
	},
	{
		accessorKey: 'role',
		header: 'Rol',
		cell: ({ row }) => (
			<Badge
				variant={
					row.original.role === 'admin' ? 'default' : 'secondary'
				}
			>
				{row.original.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}
			</Badge>
		),
		enableSorting: true
	},
	{
		id: 'actions',
		cell: ({ row }) => (
			<UserTableActions
				user={row.original}
				onRoleChange={onRoleChange}
				onDeleteUser={onDeleteUser}
			/>
		),
		enableSorting: false
	}
]
