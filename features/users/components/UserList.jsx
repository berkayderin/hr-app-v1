'use client'
import useUsers from '@/features/users/queries/useUsers'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

const UserList = () => {
	const { useFetchUsers, useUpdateUserRole, useDeleteUser } =
		useUsers()
	const { data: users, isLoading, error } = useFetchUsers()
	const updateUserRole = useUpdateUserRole()
	const deleteUser = useDeleteUser()

	if (isLoading) return <div>Kullanıcılar yükleniyor...</div>
	if (error) return <div> Hata: {error.message}</div>

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

	return (
		<Table className="border border-gray-200">
			<TableHeader>
				<TableRow>
					<TableHead>E-posta</TableHead>
					<TableHead>Rol</TableHead>
					<TableHead>Aksiyon</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{users.map((user) => (
					<TableRow key={user.id}>
						<TableCell>{user.email}</TableCell>
						<TableCell>
							<Badge
								variant={
									user.role === 'admin' ? 'default' : 'secondary'
								}
							>
								{user.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}
							</Badge>
						</TableCell>
						<TableCell className="flex items-center">
							<Select
								onValueChange={(newRole) =>
									handleRoleChange(user.id, newRole)
								}
								defaultValue={user.role}
							>
								<SelectTrigger className="w-[100px]">
									<SelectValue placeholder="Rol seç" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="user">Kullanıcı</SelectItem>
									<SelectItem value="admin">Yönetici</SelectItem>
								</SelectContent>
							</Select>
							<Button
								onClick={() => handleDeleteUser(user.id)}
								variant="destructive"
								size="sm"
								className="ml-2"
							>
								Sil
							</Button>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}

export default UserList
