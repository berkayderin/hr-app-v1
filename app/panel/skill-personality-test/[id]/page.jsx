// app/panel/skill-personality-test/[id]/page.jsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
	CardDescription
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
	Users,
	ArrowRight,
	BookOpen,
	CheckCircle,
	Circle,
	UserCheck
} from 'lucide-react'
import Link from 'next/link'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'

export default function AdminSkillPersonalityTestDetailPage() {
	const params = useParams()
	const [test, setTest] = useState(null)
	const router = useRouter()

	const translateSectionTitle = (title) => {
		const translations = {
			'IQ Test': 'IQ Testi',
			'Practical Intelligence': 'Pratik Zeka',
			'Sharp Intelligence': 'Keskin Zeka',
			'Personality Analysis': 'Kişilik Analizi'
		}
		return translations[title] || title
	}

	useEffect(() => {
		const fetchTest = async () => {
			try {
				const response = await fetch(
					`/api/skill-personality-test/${params.id}`
				)
				if (!response.ok) {
					const errorData = await response.json()
					throw new Error(errorData.error || 'Failed to fetch test')
				}
				const data = await response.json()
				setTest(data.test)
			} catch (error) {
				console.error('Error fetching test:', error)
				toast.error(error.message || 'Failed to load test')
				router.push('/panel/skill-personality-test')
			}
		}
		fetchTest()
	}, [params.id, router])

	if (!test) {
		return (
			<div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
				<Card className="max-w-md w-full">
					<CardHeader>
						<CardTitle>Test Yükleniyor</CardTitle>
						<CardDescription>
							Lütfen bekleyin, test bilgileri yükleniyor...
						</CardDescription>
					</CardHeader>
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
						<BreadcrumbLink href="/panel/skill-personality-test">
							Yetenek ve Kişilik Testleri
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
							Toplam Bölüm
						</span>
						<div className="flex items-center">
							<Badge variant="secondary" className="text-sm">
								{test.sections.length}
							</Badge>
						</div>
					</div>
					<div className="flex flex-col space-y-1">
						<span className="text-sm font-medium text-muted-foreground">
							Toplam Soru
						</span>
						<div className="flex items-center">
							<BookOpen className="h-4 w-4 mr-2 text-primary" />
							<span>
								{test.sections.reduce(
									(acc, section) => acc + section.questions.length,
									0
								)}
							</span>
						</div>
					</div>
					<div className="flex flex-col space-y-1">
						<span className="text-sm font-medium text-muted-foreground">
							Atanan Kişi Sayısı
						</span>
						<div className="flex items-center">
							<UserCheck className="h-4 w-4 mr-2 text-primary" />
							<span>{test.assignmentCount}</span>
						</div>
					</div>
					<div className="flex items-end">
						<Button asChild className="w-full">
							<Link
								href={`/panel/skill-personality-test/${params.id}/assign`}
							>
								<Users className="mr-2 h-4 w-4" />
								Testi Ata
							</Link>
						</Button>
					</div>
				</CardContent>
			</Card>

			{test.sections.map((section, sectionIndex) => (
				<Card key={sectionIndex}>
					<CardHeader>
						<CardTitle>
							{translateSectionTitle(section.title)}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-6">
							{section.questions &&
								section.questions.map((question, questionIndex) => (
									<div key={questionIndex} className="space-y-4">
										<div className="flex items-start">
											<span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium text-sm mr-3">
												{questionIndex + 1}
											</span>
											<h3 className="text-lg font-medium">
												{question.text || question.question}
											</h3>
										</div>
										<ul className="ml-11 space-y-2">
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
										{questionIndex < section.questions.length - 1 && (
											<Separator className="my-4" />
										)}
									</div>
								))}
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	)
}
