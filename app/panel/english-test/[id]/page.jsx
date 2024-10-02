// app/panel/english-test/[id]/page.js
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prismadb'
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
	CheckCircle,
	Circle,
	Users,
	BookOpen,
	ArrowRight
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default async function EnglishTestDetailPage({ params }) {
	const session = await getServerSession(authOptions)

	if (!session) {
		redirect('/login')
	}

	const test = await prisma.englishTest.findUnique({
		where: { id: params.id },
		include: { assignedTests: true }
	})

	if (!test) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
				<Card className="max-w-md w-full">
					<CardContent className="text-center py-10">
						<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
							Test Bulunamadı
						</h1>
						<p className="text-gray-600 dark:text-gray-400 mb-6">
							Aradığınız test mevcut değil veya silinmiş olabilir.
						</p>
						<Button asChild>
							<Link href="/panel/english-test">
								<ArrowRight className="mr-2 h-4 w-4" />
								Testlere Geri Dön
							</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		)
	}

	const letters = ['A', 'B', 'C', 'D']

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 py-12">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">
					{test.title}
				</h1>

				{session.user.role === 'admin' && (
					<div className="flex justify-center mb-4">
						<Button asChild size="lg">
							<Link href={`/panel/english-test/${test.id}/assign`}>
								<Users className="mr-2 h-5 w-5" />
								Testi Ata
							</Link>
						</Button>
					</div>
				)}

				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="text-2xl">Test Detayları</CardTitle>
					</CardHeader>
					<CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="flex items-center space-x-2">
							<Badge variant="secondary">{test.level}</Badge>
							<span className="text-gray-600 dark:text-gray-400">
								Seviye
							</span>
						</div>
						<div className="flex items-center space-x-2">
							<BookOpen className="h-5 w-5 text-primary" />
							<span className="text-gray-600 dark:text-gray-400">
								{test.questions.length} Soru
							</span>
						</div>
						<div className="flex items-center space-x-2">
							<Users className="h-5 w-5 text-primary" />
							<span className="text-gray-600 dark:text-gray-400">
								{test.assignedTests.length} kez atandı
							</span>
						</div>
					</CardContent>
				</Card>

				{session.user.role === 'admin' && (
					<>
						<Card className="mb-8">
							<CardHeader>
								<CardTitle className="text-2xl">Sorular</CardTitle>
							</CardHeader>
							<CardContent>
								{test.questions.map((question, index) => (
									<div
										key={index}
										className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
									>
										<h3 className="font-semibold mb-3 text-lg text-gray-900 dark:text-white">
											{index + 1}. {question.question}
										</h3>
										<ul className="space-y-2">
											{question.options.map((option, optionIndex) => (
												<li
													key={optionIndex}
													className={`flex items-center space-x-2 ${
														optionIndex === question.correctAnswer
															? 'text-green-600 dark:text-green-400 font-medium'
															: 'text-gray-700 dark:text-gray-300'
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
									</div>
								))}
							</CardContent>
						</Card>
					</>
				)}
			</div>
		</div>
	)
}
