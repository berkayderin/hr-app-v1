// features/users/components/UserList/UserTableActions.jsx
import { useState } from 'react'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { MoreHorizontal, UserCheck } from 'lucide-react'
import { DeleteUserDialog } from './DeleteUserDialog'

export function UserTableActions({
	user,
	onRoleChange,
	onDeleteUser
}) {
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

	const handleDeleteClick = () => {
		setIsDeleteDialogOpen(true)
	}

	const handleDeleteConfirm = () => {
		onDeleteUser(user.id)
		setIsDeleteDialogOpen(false)
	}

	return (
		<div className="flex items-center gap-2">
			<Select
				onValueChange={(newRole) => onRoleChange(user.id, newRole)}
				defaultValue={user.role}
			>
				<SelectTrigger className="w-[100px]">
					<SelectValue placeholder="Rol seç">
						<div className="flex items-center gap-2">
							<UserCheck className="h-4 w-4" />
							<span>
								{user.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}
							</span>
						</div>
					</SelectValue>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="user">
						<div className="flex items-center gap-2">
							<UserCheck className="h-4 w-4" />
							<span>Kullanıcı</span>
						</div>
					</SelectItem>
					<SelectItem value="admin">
						<div className="flex items-center gap-2">
							<UserCheck className="h-4 w-4" />
							<span>Yönetici</span>
						</div>
					</SelectItem>
				</SelectContent>
			</Select>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Menüyü aç</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem
						onClick={handleDeleteClick}
						className="text-destructive focus:text-destructive"
					>
						<span>Sil</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<DeleteUserDialog
				isOpen={isDeleteDialogOpen}
				onClose={() => setIsDeleteDialogOpen(false)}
				onConfirm={handleDeleteConfirm}
				userName={user.email}
			/>
		</div>
	)
}
