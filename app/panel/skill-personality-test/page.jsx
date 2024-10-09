// app/panel/skill-personality-test/page.jsx
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter
} from '@/components/ui/card'
import { BookOpen, Plus, BarChart } from 'lucide-react'
import prisma from '@/lib/prismadb'
import { Badge } from '@/components/ui/badge'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

export default async function ViewSkillPersonalityTestsPage() {
	const session = await getServerSession(authOptions)

	if (!session) {
		redirect('/login')
	}

	const translateSectionTitle = (title) => {
		const translations = {
			'IQ Test': 'IQ Testi',
			'Practical Intelligence': 'Pratik Zeka',
			'Sharp Intelligence': 'Keskin Zeka',
			'Personality Analysis': 'Kişilik Analizi'
		}
		return translations[title] || title
	}

	let tests = []
	try {
		if (session.user.role === 'admin') {
			tests = await prisma.skillPersonalityTest.findMany({
				orderBy: { createdAt: 'desc' }
			})
		} else {
			const assignedTests =
				await prisma.assignedSkillPersonalityTest.findMany({
					where: {
						userId: session.user.id,
						completedAt: null
					},
					include: {
						test: true
					},
					orderBy: { assignedAt: 'desc' }
				})
			tests = assignedTests.map((at) => ({
				...at.test,
				assignedTestId: at.id
			}))
		}
	} catch (error) {
		console.error('Testleri getirme başarısız:', error)
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
							Yetenek ve Kişilik Testleri
						</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<div className="flex justify-end items-center">
				{session.user.role === 'admin' && (
					<Button asChild>
						<Link href="/panel/skill-personality-test/create">
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
							Şu anda mevcut test bulunmamaktadır.
						</p>
					</CardContent>
				</Card>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{tests.map((test) => (
						<Card key={test.id} className="flex flex-col">
							<CardHeader>
								<CardTitle className="flex items-center justify-between">
									<span>{test.title}</span>
									<BarChart className="h-5 w-5 text-muted-foreground" />
								</CardTitle>
							</CardHeader>
							<CardContent className="flex-grow">
								<div className="flex flex-wrap gap-2">
									{test.sections.map((section, index) => (
										<Badge
											key={index}
											variant="secondary"
											className="text-xs"
										>
											{translateSectionTitle(section.title)}
										</Badge>
									))}
								</div>
							</CardContent>
							<CardFooter>
								<Button asChild className="w-full">
									<Link
										href={
											session.user.role === 'admin'
												? `/panel/skill-personality-test/${test.id}`
												: `/panel/skill-personality-test/take/${test.assignedTestId}`
										}
									>
										<BookOpen className="mr-2 h-4 w-4" />
										{session.user.role === 'admin'
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
