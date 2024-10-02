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
import { BookOpen, Plus } from 'lucide-react'
import prisma from '@/lib/prismadb'

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
		<div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 py-12">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">
					İngilizce Testleri
				</h1>
				{tests.length === 0 ? (
					<Card className="max-w-md mx-auto">
						<CardContent className="text-center py-10">
							<p className="text-lg text-gray-600 dark:text-gray-400">
								Şu anda mevcut test bulunmamaktadır.
							</p>
						</CardContent>
					</Card>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{tests.map((test) => (
							<Card key={test.id}>
								<CardHeader>
									<CardTitle className="text-xl font-semibold">
										{test.title}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-gray-600 dark:text-gray-400">
										Seviye: {test.level}
									</p>
									<p className="text-sm text-gray-600 dark:text-gray-400">
										Soru Sayısı: {test.questions.length}
									</p>
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
				{session.user.role === 'admin' && (
					<div className="mt-12 text-center">
						<Button asChild size="lg">
							<Link href="/panel/english-test/create">
								<Plus className="mr-2 h-5 w-5" />
								Yeni Test Oluştur
							</Link>
						</Button>
					</div>
				)}
			</div>
		</div>
	)
}
