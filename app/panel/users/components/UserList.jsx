'use client'

import React, { useState } from 'react'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import { toast } from '@/hooks/use-toast'

const UserList = ({ initialUsers }) => {
	const [users, setUsers] = useState(initialUsers)

	console.log('Users in UserList:', users)

	const handleRoleChange = async (userId, newRole) => {
		try {
			const response = await fetch('/api/users/update-role', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ userId, newRole })
			})

			if (!response.ok) {
				throw new Error('Failed to update user role')
			}

			setUsers(
				users.map((user) =>
					user.id === userId ? { ...user, role: newRole } : user
				)
			)

			toast({
				title: 'Başarılı',
				description: 'Kullanıcı rolü güncellendi.'
			})
		} catch (error) {
			console.error('Error updating user role:', error)
			toast({
				title: 'Hata',
				description: 'Kullanıcı rolü güncellenirken bir hata oluştu.',
				variant: 'destructive'
			})
		}
	}

	return (
		<Table className="border">
			<TableHeader>
				<TableRow>
					<TableHead>E-posta</TableHead>
					<TableHead>Rol</TableHead>
					<TableHead>Kayıt Tarihi</TableHead>
					<TableHead>İşlemler</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{users?.map((user) => (
					<TableRow key={user.id}>
						<TableCell>{user.email}</TableCell>
						<TableCell>{user.role}</TableCell>
						<TableCell>
							{new Date(user.createdAt).toLocaleDateString()}
						</TableCell>
						<TableCell>
							<Select
								onValueChange={(newRole) =>
									handleRoleChange(user.id, newRole)
								}
								defaultValue={user.role}
							>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Rol seç" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="user">Kullanıcı</SelectItem>
									<SelectItem value="admin">Admin</SelectItem>
								</SelectContent>
							</Select>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}

export default UserList
