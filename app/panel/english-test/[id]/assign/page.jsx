// app/panel/english-test/[id]/assign/page.js
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

export default function AssignEnglishTestPage({ params }) {
	const [users, setUsers] = useState([])
	const [selectedUser, setSelectedUser] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [isUserLoading, setIsUserLoading] = useState(true)
	const router = useRouter()
	const { toast } = useToast()

	useEffect(() => {
		const fetchUsers = async () => {
			setIsUserLoading(true)
			try {
				const response = await fetch('/api/users')
				if (!response.ok) {
					throw new Error('Failed to fetch users')
				}
				const data = await response.json()
				setUsers(data)
			} catch (error) {
				console.error('Error fetching users:', error)
				toast({
					variant: 'destructive',
					title: 'Error',
					description: 'Failed to load users. Please try again.'
				})
			} finally {
				setIsUserLoading(false)
			}
		}
		fetchUsers()
	}, [toast])

	const handleSubmit = async (e) => {
		e.preventDefault()
		setIsLoading(true)
		try {
			const response = await fetch('/api/english-test/assign', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					testId: params.id,
					userId: selectedUser
				})
			})
			if (!response.ok) {
				throw new Error('Failed to assign test')
			}
			toast({
				title: 'Success',
				description: 'Test assigned successfully'
			})
			router.push('/panel/english-test')
		} catch (error) {
			console.error('Error assigning test:', error)
			toast({
				variant: 'destructive',
				title: 'Error',
				description: 'Failed to assign test. Please try again.'
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-3xl font-bold mb-8">Assign English Test</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
				<Select
					value={selectedUser}
					onValueChange={setSelectedUser}
					disabled={isUserLoading}
					required
				>
					<SelectTrigger>
						<SelectValue
							placeholder={
								isUserLoading ? 'Loading users...' : 'Select User'
							}
						/>
					</SelectTrigger>
					<SelectContent>
						{users.map((user) => (
							<SelectItem key={user.id} value={user.id}>
								{user.email}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Button type="submit" disabled={isLoading || isUserLoading}>
					{isLoading ? 'Assigning...' : 'Assign Test'}
				</Button>
			</form>
		</div>
	)
}
