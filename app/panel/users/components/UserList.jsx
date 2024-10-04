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
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const UserList = ({ initialUsers }) => {
	const [users, setUsers] = useState(initialUsers)

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

	const handleDeleteUser = async (userId) => {
		if (
			!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')
		) {
			return
		}

		try {
			const response = await fetch('/api/users/delete', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ userId })
			})

			if (!response.ok) {
				throw new Error('Failed to delete user')
			}

			setUsers(users.filter((user) => user.id !== userId))

			toast({
				title: 'Başarılı',
				description: 'Kullanıcı başarıyla silindi.'
			})
		} catch (error) {
			console.error('Error deleting user:', error)
			toast({
				title: 'Hata',
				description: 'Kullanıcı silinirken bir hata oluştu.',
				variant: 'destructive'
			})
		}
	}

	const formatDate = (dateString) => {
		const options = {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}
		return new Date(dateString).toLocaleDateString('tr-TR', options)
	}

	const getRoleBadge = (role) => {
		const roleText = role === 'user' ? 'Kullanıcı' : 'Yönetici'
		const variant = role === 'user' ? 'secondary' : 'default'
		return <Badge variant={variant}>{roleText}</Badge>
	}

	return (
		<Table className="border border-gray-200">
			<TableHeader>
				<TableRow>
					<TableHead>E-posta</TableHead>
					<TableHead>Rol</TableHead>
					<TableHead>Kayıt Tarihi</TableHead>
					<TableHead>İşlemler</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{users
					?.map((user) => (
						<TableRow key={user.id}>
							<TableCell>{user.email}</TableCell>
							<TableCell>{getRoleBadge(user.role)}</TableCell>
							<TableCell>{formatDate(user.createdAt)}</TableCell>
							<TableCell className="flex items-center">
								<Select
									onValueChange={(newRole) =>
										handleRoleChange(user.id, newRole)
									}
									defaultValue={user.role}
								>
									<SelectTrigger className="w-[120px]">
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
									className="ml-2"
								>
									Sil
								</Button>
							</TableCell>
						</TableRow>
					))
					.reverse()}
			</TableBody>
		</Table>
	)
}

export default UserList
