// app/panel/skill-personality-test/[id]/assign/page.jsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter
} from '@/components/ui/card'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Users, ArrowLeft, Send } from 'lucide-react'
import Link from 'next/link'

export default function AssignSkillPersonalityTestPage() {
	const params = useParams()
	const router = useRouter()
	const [users, setUsers] = useState([])
	const [selectedUsers, setSelectedUsers] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [test, setTest] = useState(null)

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch test details
				const testResponse = await fetch(
					`/api/skill-personality-test/${params.id}`
				)
				if (!testResponse.ok) throw new Error('Failed to fetch test')
				const testData = await testResponse.json()
				setTest(testData.test)

				// Fetch users
				const usersResponse = await fetch('/api/users')
				if (!usersResponse.ok)
					throw new Error('Failed to fetch users')
				const usersData = await usersResponse.json()
				setUsers(usersData)
			} catch (error) {
				console.error('Error fetching data:', error)
				toast.error('Failed to load data')
				router.push('/panel/skill-personality-test')
			}
		}
		fetchData()
	}, [params.id, router])

	const handleUserSelect = (selectedValues) => {
		// Ensure selectedValues is always an array
		setSelectedUsers(
			Array.isArray(selectedValues)
				? selectedValues
				: [selectedValues]
		)
	}

	const handleAssign = async () => {
		if (selectedUsers.length === 0) {
			toast.error('Please select at least one user')
			return
		}

		setIsLoading(true)
		try {
			const payload = {
				testId: params.id,
				userIds: selectedUsers
			}
			console.log('Sending payload:', payload) // Log the payload

			const response = await fetch(
				'/api/skill-personality-test/assign',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload)
				}
			)

			const result = await response.json()
			console.log('Received response:', result) // Log the response

			if (!response.ok) {
				throw new Error(result.error || 'Failed to assign test')
			}

			if (result.successfulAssignments?.length > 0) {
				toast.success(
					`Successfully assigned to ${result.successfulAssignments.length} users`
				)
			}

			if (result.failedAssignments?.length > 0) {
				toast.error(
					`Failed to assign to ${result.failedAssignments.length} users`
				)
				console.error('Failed assignments:', result.failedAssignments)
			}

			router.push(`/panel/skill-personality-test/${params.id}`)
		} catch (error) {
			console.error('Error assigning test:', error)
			toast.error(error.message || 'Failed to assign test')
		} finally {
			setIsLoading(false)
		}
	}

	if (!test) return <div>Loading...</div>

	return (
		<div className="container mx-auto p-4 space-y-6">
			<h1 className="text-3xl font-bold">
				Assign Test: {test.title}
			</h1>

			<Card>
				<CardHeader>
					<CardTitle>Select Users</CardTitle>
				</CardHeader>
				<CardContent>
					<Select
						multiple
						value={selectedUsers}
						onValueChange={handleUserSelect}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select users to assign the test" />
						</SelectTrigger>
						<SelectContent>
							{users.map((user) => (
								<SelectItem key={user.id} value={user.id}>
									{user.email}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</CardContent>
				<CardFooter className="flex justify-between">
					<Button asChild variant="outline">
						<Link href={`/panel/skill-personality-test/${params.id}`}>
							<ArrowLeft className="mr-2 h-4 w-4" /> Back to Test
						</Link>
					</Button>
					<Button onClick={handleAssign} disabled={isLoading}>
						<Users className="mr-2 h-4 w-4" />
						{isLoading ? 'Assigning...' : 'Assign Test'}
					</Button>
				</CardFooter>
			</Card>
		</div>
	)
}
