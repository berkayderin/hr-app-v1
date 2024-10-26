// app/panel/english-test/page.jsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter
} from '@/components/ui/card'
import { BookOpen, Plus, BarChart, Trash2 } from 'lucide-react'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Badge } from '@/components/ui/badge'

import { toast } from 'sonner'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'

// DeleteTestButton bileşeni
const DeleteTestButton = ({ testId, onDelete }) => {
	const [open, setOpen] = useState(false)

	const handleDelete = async () => {
		try {
			const response = await fetch(`/api/english-test/${testId}`, {
				method: 'DELETE'
			})

			if (!response.ok) {
				throw new Error('Failed to delete test')
			}

			onDelete(testId)
			toast.success('Test başarıyla silindi')
			setOpen(false)
		} catch (error) {
			console.error('Error deleting test:', error)
			toast.error('Test silinirken bir hata oluştu')
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="absolute top-2 right-2 hover:bg-destructive/10 hover:text-destructive"
				>
					<Trash2 className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						Testi Silmek İstediğinize Emin misiniz?
					</DialogTitle>
					<DialogDescription>
						Bu işlem geri alınamaz. Test ve ilgili tüm yanıtlar kalıcı
						olarak silinecektir.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={() => setOpen(false)}>
						İptal
					</Button>
					<Button variant="destructive" onClick={handleDelete}>
						Sil
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default function ViewEnglishTestsPage() {
	const [tests, setTests] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [userRole, setUserRole] = useState(null)
	const router = useRouter()

	useEffect(() => {
		const fetchTests = async () => {
			try {
				const response = await fetch('/api/english-test')
				if (!response.ok) {
					throw new Error('Failed to fetch tests')
				}
				const data = await response.json()
				setTests(data.tests)
				setUserRole(data.userRole)
			} catch (err) {
				setError(err.message)
				toast.error('Testler yüklenirken bir hata oluştu')
			} finally {
				setLoading(false)
			}
		}

		fetchTests()
	}, [])

	const handleTestDelete = (deletedTestId) => {
		setTests((prevTests) =>
			prevTests.filter((test) => test.id !== deletedTestId)
		)
	}

	if (loading) {
		return (
			<div className="container mx-auto p-4">
				<div className="flex justify-center items-center min-h-[200px]">
					<p className="text-muted-foreground">Yükleniyor...</p>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="container mx-auto p-4">
				<div className="flex justify-center items-center min-h-[200px]">
					<p className="text-destructive">
						Bir hata oluştu. Lütfen sayfayı yenileyin.
					</p>
				</div>
			</div>
		)
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
						<BreadcrumbPage className="font-medium">
							İngilizce Testleri
						</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<div className="flex justify-end items-center">
				{userRole === 'admin' && (
					<Button asChild>
						<Link href="/panel/english-test/create">
							<Plus className="mr-2 h-4 w-4" />
							Yeni Test Oluştur
						</Link>
					</Button>
				)}
			</div>

			{tests.length === 0 ? (
				<Card className="max-w-md mx-auto">
					<CardContent className="text-center py-10">
						<p className="text-lg text-muted-foreground">
							{userRole === 'admin'
								? 'Henüz hiç test oluşturulmamış.'
								: 'Size atanmış herhangi bir test bulunmamaktadır.'}
						</p>
					</CardContent>
				</Card>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{tests.map((test) => (
						<Card key={test.id} className="flex flex-col relative">
							{userRole === 'admin' && (
								<DeleteTestButton
									testId={test.id}
									onDelete={handleTestDelete}
								/>
							)}
							<CardHeader>
								<CardTitle className="flex items-center justify-between">
									<span>{test.title}</span>
								</CardTitle>
							</CardHeader>
							<CardContent className="flex-grow">
								<div className="flex flex-wrap gap-2">
									<Badge variant="secondary" className="text-xs">
										Seviye: {test.level}
									</Badge>
									<Badge variant="secondary" className="text-xs">
										Soru Sayısı: {test.questions.length}
									</Badge>
								</div>
							</CardContent>
							<CardFooter>
								<Button asChild className="w-full">
									<Link
										href={
											userRole === 'admin'
												? `/panel/english-test/${test.id}`
												: `/panel/english-test/take/${test.assignedTestId}`
										}
									>
										<BookOpen className="mr-2 h-4 w-4" />
										{userRole === 'admin'
											? 'Detayları Görüntüle'
											: 'Testi Başlat'}
									</Link>
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>
			)}
		</div>
	)
}
