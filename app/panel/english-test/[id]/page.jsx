// app/panel/english-test/[id]/page.js
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
	CardDescription
} from '@/components/ui/card'
import {
	CheckCircle,
	Circle,
	Users,
	BookOpen,
	ArrowRight
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { useSession } from 'next-auth/react'
import AssignedUsersDialog from '@/components/AssignedUsersDialog'

export default function EnglishTestDetailPage() {
	const params = useParams()
	const router = useRouter()
	const { data: session } = useSession()
	const [test, setTest] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchTest = async () => {
			try {
				const response = await fetch(`/api/english-test/${params.id}`)
				if (!response.ok) {
					throw new Error('Failed to fetch test')
				}
				const data = await response.json()
				setTest(data)
			} catch (error) {
				console.error('Error fetching test:', error)
				toast.error('Test yüklenirken bir hata oluştu')
				router.push('/panel/english-test')
			} finally {
				setLoading(false)
			}
		}

		if (session?.user) {
			fetchTest()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.id, session])

	const handleCorrectAnswerChange = async (
		questionIndex,
		newValue
	) => {
		try {
			const response = await fetch(`/api/english-test/${params.id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					questionIndex,
					newCorrectAnswer: parseInt(newValue)
				})
			})

			if (!response.ok) {
				throw new Error('Failed to update correct answer')
			}

			const updatedTest = await response.json()
			setTest(updatedTest)
			toast.success('Doğru cevap güncellendi')
		} catch (error) {
			console.error('Error updating correct answer:', error)
			toast.error('Doğru cevap güncellenirken bir hata oluştu')
		}
	}

	if (loading)
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
			</div>
		)

	if (!test) {
		return (
			<div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
				<Card className="max-w-md w-full">
					<CardHeader>
						<CardTitle>Test Bulunamadı</CardTitle>
						<CardDescription>
							Aradığınız test mevcut değil veya silinmiş olabilir.
						</CardDescription>
					</CardHeader>
					<CardFooter>
						<Button asChild className="w-full">
							<Link href="/panel/english-test">
								<ArrowRight className="mr-2 h-4 w-4" />
								Testlere Geri Dön
							</Link>
						</Button>
					</CardFooter>
				</Card>
			</div>
		)
	}

	const letters = ['A', 'B', 'C', 'D']

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
							{test.title}
						</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold text-primary">
					{test.title}
				</h1>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Test Detayları</CardTitle>
				</CardHeader>
				<CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
					<div className="flex flex-col space-y-1">
						<span className="text-sm font-medium text-muted-foreground">
							Seviye
						</span>
						<div className="flex items-center">
							<Badge variant="secondary" className="text-sm">
								{test.level}
							</Badge>
						</div>
					</div>
					<div className="flex flex-col space-y-1">
						<span className="text-sm font-medium text-muted-foreground">
							Soru Sayısı
						</span>
						<div className="flex items-center">
							<BookOpen className="h-4 w-4 mr-2 text-primary" />
							<span>{test.questions.length}</span>
						</div>
					</div>
					<div className="flex flex-col space-y-1">
						<span className="text-sm font-medium text-muted-foreground">
							Atanma Sayısı
						</span>
						<div className="flex items-center">
							<Users className="h-4 w-4 mr-2 text-primary" />
							<span>{test.assignedTests.length}</span>
						</div>
					</div>
					{session?.user?.role === 'admin' && (
						<div className="flex items-end gap-2">
							<Button asChild className="w-full">
								<Link href={`/panel/english-test/${test.id}/assign`}>
									<Users className="mr-2 h-4 w-4" />
									Testi Ata
								</Link>
							</Button>

							<AssignedUsersDialog
								assignedTests={test.assignedTests}
							/>
						</div>
					)}
				</CardContent>
			</Card>

			{session?.user?.role === 'admin' && (
				<Card>
					<CardHeader>
						<CardTitle>Sorular</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-6">
							{test.questions.map((question, index) => (
								<div key={index} className="space-y-4">
									<div className="flex items-start">
										<span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium text-sm mr-3">
											{index + 1}
										</span>
										<h3 className="text-lg font-medium">
											{question.question}
										</h3>
									</div>
									<div className="ml-11 space-y-4">
										<ul className="space-y-2">
											{question.options.map((option, optionIndex) => (
												<li
													key={optionIndex}
													className={`flex items-center space-x-2 ${
														optionIndex === question.correctAnswer
															? 'text-green-600 dark:text-green-400 font-medium'
															: 'text-muted-foreground'
													}`}
												>
													{optionIndex === question.correctAnswer ? (
														<CheckCircle className="h-5 w-5" />
													) : (
														<Circle className="h-5 w-5" />
													)}
													<span>
														{letters[optionIndex]}) {option}
													</span>
												</li>
											))}
										</ul>
										<div className="flex items-center space-x-2">
											<span className="text-sm font-medium text-muted-foreground">
												Doğru Cevap:
											</span>
											<Select
												defaultValue={question.correctAnswer.toString()}
												onValueChange={(value) =>
													handleCorrectAnswerChange(index, value)
												}
											>
												<SelectTrigger className="w-20">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													{question.options.map((_, optionIndex) => (
														<SelectItem
															key={optionIndex}
															value={optionIndex.toString()}
														>
															{letters[optionIndex]}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									</div>
									{index < test.questions.length - 1 && (
										<Separator className="my-4" />
									)}
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	)
}
