// app/api/english-test/submit/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import prisma from '@/lib/prismadb'

export const dynamic = 'force-dynamic'

export async function POST(request) {
	try {
		const session = await getServerSession(authOptions)

		if (!session) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const { testId, answers } = await request.json()

		let assignedTest = await prisma.assignedTest.findUnique({
			where: { id: testId },
			include: { test: true }
		})

		if (!assignedTest) {
			assignedTest = await prisma.assignedTest.findFirst({
				where: {
					testId: testId,
					userId: session.user.id,
					completedAt: null
				},
				include: { test: true }
			})
		}

		if (!assignedTest) {
			const completedTest = await prisma.assignedTest.findFirst({
				where: {
					OR: [{ id: testId }, { testId: testId }],
					userId: session.user.id,
					completedAt: { not: null }
				}
			})

			if (completedTest) {
				return NextResponse.json(
					{
						error: 'Test already completed',
						testId,
						userId: session.user.id
					},
					{ status: 400 }
				)
			}

			return NextResponse.json(
				{ error: 'Test not found', testId, userId: session.user.id },
				{ status: 404 }
			)
		}

		if (assignedTest.completedAt) {
			return NextResponse.json(
				{
					error: 'Test already completed',
					testId: assignedTest.id,
					userId: session.user.id
				},
				{ status: 400 }
			)
		}

		const score = calculateScore(assignedTest.test.questions, answers)

		const updatedAssignedTest = await prisma.assignedTest.update({
			where: { id: assignedTest.id },
			data: {
				completedAt: new Date(),
				score: score,
				answers: answers
			}
		})

		return NextResponse.json(updatedAssignedTest)
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to submit test', details: error.message },
			{ status: 500 }
		)
	}
}

function calculateScore(questions, answers) {
	let correctAnswers = 0
	questions.forEach((question, index) => {
		if (question.correctAnswer === parseInt(answers[index])) {
			correctAnswers++
		}
	})
	return Math.round((correctAnswers / questions.length) * 100)
}
