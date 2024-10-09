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
import { Loader2, Users } from 'lucide-react'
import Link from 'next/link'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

export default function AssignSkillPersonalityTestPage() {
	const params = useParams()
	const router = useRouter()
	const [users, setUsers] = useState([])
	const [selectedUsers, setSelectedUsers] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [isUserLoading, setIsUserLoading] = useState(true)
	const [test, setTest] = useState(null)

	useEffect(() => {
		const fetchData = async () => {
			setIsUserLoading(true)
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
				toast.error('Veri yüklenemedi. Lütfen tekrar deneyin.')
				router.push('/panel/skill-personality-test')
			} finally {
				setIsUserLoading(false)
			}
		}
		fetchData()
	}, [params.id, router])

	const handleUserSelect = (selectedValues) => {
		setSelectedUsers(
			Array.isArray(selectedValues)
				? selectedValues
				: [selectedValues]
		)
	}

	const handleAssign = async () => {
		if (selectedUsers.length === 0) {
			toast.error('Lütfen en az bir kullanıcı seçin')
			return
		}

		setIsLoading(true)
		try {
			const response = await fetch(
				'/api/skill-personality-test/assign',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						testId: params.id,
						userIds: selectedUsers
					})
				}
			)

			const result = await response.json()

			if (!response.ok) {
				throw new Error(result.error || 'Test atanamadı')
			}

			if (result.successfulAssignments?.length > 0) {
				toast.success(
					`${result.successfulAssignments.length} kullanıcıya başarıyla atandı`
				)
			}

			if (result.failedAssignments?.length > 0) {
				toast.error(
					`${result.failedAssignments.length} kullanıcıya atama yapılamadı`
				)
			}

			router.push(`/panel/skill-personality-test/${params.id}`)
		} catch (error) {
			console.error('Test atama hatası:', error)
			toast.error('Test atanırken bir hata oluştu')
		} finally {
			setIsLoading(false)
		}
	}

	if (!test) return <div>Yükleniyor...</div>

	return (
		<div className="container mx-auto p-4 space-y-6">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/panel">Ana Sayfa</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href="/panel/skill-personality-test">
							Yetenek ve Kişilik Testleri
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage className="font-medium">
							Test Ata
						</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<Card className="max-w-lg">
				<CardHeader>
					<CardTitle>
						Yetenek ve Kişilik Testi Ata: {test.title}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						<label
							htmlFor="user-select"
							className="block text-sm font-medium"
						>
							Kullanıcı Seçin
						</label>
						<Select
							value={selectedUsers}
							onValueChange={handleUserSelect}
							disabled={isUserLoading}
						>
							<SelectTrigger id="user-select" className="w-full">
								<SelectValue placeholder="Kullanıcı seçin" />
							</SelectTrigger>
							<SelectContent>
								{users.map((user) => (
									<SelectItem key={user.id} value={user.id}>
										{user.email}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{selectedUsers.length > 0 && (
							<div className="mt-2">
								<p className="text-sm font-medium">
									Seçilen Kullanıcılar:
								</p>
								<ul className="list-disc list-inside">
									{selectedUsers.map((userId) => {
										const user = users.find((u) => u.id === userId)
										return user ? (
											<li key={userId} className="text-sm">
												{user.email}
											</li>
										) : null
									})}
								</ul>
							</div>
						)}
					</div>
				</CardContent>
				<CardFooter>
					<Button
						className="w-full"
						onClick={handleAssign}
						disabled={
							isLoading || isUserLoading || selectedUsers.length === 0
						}
					>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Atanıyor...
							</>
						) : (
							<>
								<Users className="mr-2 h-4 w-4" />
								Testi Ata ({selectedUsers.length} kullanıcı)
							</>
						)}
					</Button>
				</CardFooter>
			</Card>
		</div>
	)
}
