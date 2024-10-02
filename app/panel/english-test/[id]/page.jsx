// app/panel/english-test/[id]/page.js
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prismadb'
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

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
		return <div>Test not found</div>
	}

	const letters = ['a', 'b', 'c', 'd']

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-3xl font-bold mb-8">{test.title}</h1>
			<Card className="mb-8">
				<CardHeader>
					<CardTitle>Test Details</CardTitle>
				</CardHeader>
				<CardContent>
					<p>Level: {test.level}</p>
					<p>Questions: {test.questions.length}</p>
					<p>Assigned: {test.assignedTests.length} times</p>
				</CardContent>
			</Card>

			{session.user.role === 'admin' && (
				<>
					<Card className="mb-8">
						<CardHeader>
							<CardTitle>Questions</CardTitle>
						</CardHeader>
						<CardContent>
							{test.questions.map((question, index) => (
								<div key={index} className="mb-6">
									<h3 className="font-semibold mb-2">
										{index + 1}. {question.question}
									</h3>
									<ul className="list-none pl-6">
										{question.options.map((option, optionIndex) => (
											<li
												key={optionIndex}
												className={
													optionIndex === question.correctAnswer
														? 'font-bold'
														: ''
												}
											>
												{letters[optionIndex]}) {option}
												{optionIndex === question.correctAnswer &&
													' (Correct Answer)'}
											</li>
										))}
									</ul>
								</div>
							))}
						</CardContent>
					</Card>

					<Button asChild className="mt-4">
						<Link href={`/panel/english-test/${test.id}/assign`}>
							Assign Test
						</Link>
					</Button>
				</>
			)}
		</div>
	)
}
