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
import { toast } from 'sonner'
import { Loader2, Users } from 'lucide-react'
import Select from 'react-select'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Label } from '@/components/ui/label'

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
				const testResponse = await fetch(
					`/api/skill-personality-test/${params.id}`
				)
				if (!testResponse.ok) throw new Error('Failed to fetch test')
				const testData = await testResponse.json()
				setTest(testData.test)

				const usersResponse = await fetch('/api/users')
				if (!usersResponse.ok)
					throw new Error('Failed to fetch users')
				const usersData = await usersResponse.json()
				setUsers(
					usersData.map((user) => ({
						value: user.id,
						label: user.email
					}))
				)
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

	const handleUserSelect = (selectedOptions) => {
		setSelectedUsers(selectedOptions)
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
						userIds: selectedUsers.map((user) => user.value)
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
					<Label htmlFor="user-select"> Kullanıcı Seçin</Label>
					<Select
						id="user-select"
						isMulti
						options={users}
						value={selectedUsers}
						onChange={handleUserSelect}
						isDisabled={isUserLoading}
						placeholder="Kullanıcı seçin"
						noOptionsMessage={() => 'Kullanıcı bulunamadı'}
						className="react-select-container"
						classNamePrefix="react-select"
					/>
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
