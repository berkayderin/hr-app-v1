// app/panel/english-test/page.jsx
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
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Badge } from '@/components/ui/badge'

export default async function ViewEnglishTestsPage() {
	const session = await getServerSession(authOptions)

	if (!session) {
		redirect('/login')
	}

	let tests = []
	try {
		if (session.user.role === 'admin') {
			tests = await prisma.englishTest.findMany({
				orderBy: { createdAt: 'desc' }
			})
		} else {
			const assignedTests = await prisma.assignedTest.findMany({
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
		console.log('Kullanıcı için testler:', tests)
	} catch (error) {
		console.error('İngilizce testleri getirme başarısız:', error)
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
						<BreadcrumbPage>İngilizce Testleri</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<div className="flex justify-end items-center">
				{/* <h1 className="text-3xl font-bold">İngilizce Testleri</h1> */}
				{session.user.role === 'admin' && (
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
											session.user.role === 'admin'
												? `/panel/english-test/${test.id}`
												: `/panel/english-test/take/${test.assignedTestId}`
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
