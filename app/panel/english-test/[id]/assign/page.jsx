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
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter
} from '@/components/ui/card'
import { Loader2, Users, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
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
					throw new Error('Kullanıcılar yüklenemedi')
				}
				const data = await response.json()
				setUsers(data)
			} catch (error) {
				console.error('Kullanıcıları yükleme hatası:', error)
				toast({
					variant: 'destructive',
					title: 'Hata',
					description:
						'Kullanıcılar yüklenemedi. Lütfen tekrar deneyin.'
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
			const data = await response.json()
			if (!response.ok) {
				throw new Error(data.error || 'Test atanamadı')
			}
			toast({
				title: 'Başarılı',
				description: 'Test başarıyla atandı',
				icon: <CheckCircle className="h-5 w-5 text-green-500" />
			})
			router.push('/panel/english-test')
		} catch (error) {
			console.error('Test atama hatası:', error)
			toast({
				variant: 'destructive',
				title: 'Hata',
				description:
					error.message || 'Test atanamadı. Lütfen tekrar deneyin.'
			})
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
								Kullanıcı Seçin
							</label>
							<Select
								value={selectedUser}
								onValueChange={setSelectedUser}
								disabled={isUserLoading}
							>
								<SelectTrigger id="user-select" className="w-full">
									<SelectValue
										placeholder={
											isUserLoading
												? 'Kullanıcılar yükleniyor...'
												: 'Kullanıcı Seçin'
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
						</div>
					</form>
				</CardContent>
				<CardFooter>
					<Button
						type="submit"
						className="w-full"
						onClick={handleSubmit}
						disabled={isLoading || isUserLoading || !selectedUser}
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
