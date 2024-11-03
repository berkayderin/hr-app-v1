// app/panel/english-test/[id]/assign/page.js
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Select from 'react-select'
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter
} from '@/components/ui/card'
import { Loader2, Users } from 'lucide-react'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { toast } from 'sonner'

export default function AssignEnglishTestPage({ params }) {
	const [users, setUsers] = useState([])
	const [selectedUsers, setSelectedUsers] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [isUserLoading, setIsUserLoading] = useState(true)
	const router = useRouter()

	useEffect(() => {
		const fetchUsers = async () => {
			setIsUserLoading(true)
			try {
				const response = await fetch('/api/users')
				if (!response.ok) {
					throw new Error('Kullanıcılar yüklenemedi')
				}
				const data = await response.json()
				setUsers(
					data.map((user) => ({ value: user.id, label: user.email }))
				)
			} catch (error) {
				toast.error(
					'Kullanıcılar yüklenemedi. Lütfen tekrar deneyin.'
				)
			} finally {
				setIsUserLoading(false)
			}
		}
		fetchUsers()
	}, [])

	const handleSubmit = async (e) => {
		e.preventDefault()
		setIsLoading(true)
		try {
			const response = await fetch('/api/english-test/assign', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					testId: params.id,
					userIds: selectedUsers.map((user) => user.value)
				})
			})
			const data = await response.json()
			if (!response.ok) {
				throw new Error(data.error || 'Test atanamadı')
			}
			toast.success('Test başarıyla atandı')
			router.push('/panel/english-test')
		} catch (error) {
			toast.error('Test atanırken bir hata oluştu')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="container mx-auto p-4 space-y-6">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/panel">Ana Sayfa</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href="/panel/english-test">
							İngilizce Testleri
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
					<CardTitle>İngilizce Testi Ata</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<label
								htmlFor="user-select"
								className="block text-sm font-medium"
							>
								Kullanıcıları Seçin
							</label>
							<Select
								isMulti
								options={users}
								value={selectedUsers}
								onChange={setSelectedUsers}
								isLoading={isUserLoading}
								isDisabled={isUserLoading}
								placeholder={
									isUserLoading
										? 'Kullanıcılar yükleniyor...'
										: 'Kullanıcıları Seçin'
								}
								noOptionsMessage={() => 'Kullanıcı bulunamadı'}
								className="basic-multi-select"
								classNamePrefix="select"
							/>
						</div>
					</form>
				</CardContent>
				<CardFooter>
					<Button
						type="submit"
						className="w-full"
						onClick={handleSubmit}
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
								Testi Ata
							</>
						)}
					</Button>
				</CardFooter>
			</Card>
		</div>
	)
}
