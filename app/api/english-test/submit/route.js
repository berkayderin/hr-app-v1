// app/api/english-test/submit/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import prisma from '@/lib/prismadb'

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

		const assignedTest = await prisma.assignedTest.findFirst({
			where: {
				testId: testId,
				userId: session.user.id,
				completedAt: null
			},
			include: { test: true }
		})

		if (!assignedTest) {
			return NextResponse.json(
				{ error: 'Test not found or already completed' },
				{ status: 404 }
			)
		}

		const score = calculateScore(assignedTest.test.questions, answers)

		const updatedAssignedTest = await prisma.assignedTest.update({
			where: { id: assignedTest.id },
			data: {
				completedAt: new Date(),
				score: score
			}
		})

		return NextResponse.json(updatedAssignedTest)
	} catch (error) {
		console.error('Error in /api/english-test/submit:', error)
		return NextResponse.json(
			{ error: 'Failed to submit test', details: error.message },
			{ status: 500 }
		)
	}
}

function calculateScore(questions, answers) {
	let correctAnswers = 0
	questions.forEach((question, index) => {
		if (question.correctAnswer === answers[index]) {
			correctAnswers++
		}
	})
	return Math.round((correctAnswers / questions.length) * 100)
}
