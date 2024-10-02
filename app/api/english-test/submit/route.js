// app/api/english-test/submit/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import prisma from '@/lib/prismadb'

console.log(
	'API route file loaded: /api/english-test/submit/route.js'
)

export async function POST(request) {
	console.log('POST request received at /api/english-test/submit')
	try {
		const session = await getServerSession(authOptions)
		console.log('Session:', JSON.stringify(session, null, 2))

		if (!session) {
			console.log('Unauthorized: No session found')
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const { testId, answers } = await request.json()
		console.log('Received testId:', testId)
		console.log('Received answers:', JSON.stringify(answers, null, 2))

		// Check if the testId is actually an assignedTestId
		let assignedTest = await prisma.assignedTest.findUnique({
			where: { id: testId },
			include: { test: true }
		})

		if (!assignedTest) {
			// If not found by id, try to find by testId and userId
			assignedTest = await prisma.assignedTest.findFirst({
				where: {
					testId: testId,
					userId: session.user.id,
					completedAt: null
				},
				include: { test: true }
			})
		}

		console.log(
			'Found assignedTest:',
			JSON.stringify(assignedTest, null, 2)
		)

		if (!assignedTest) {
			console.log(
				`Test not found. TestID/AssignedTestID: ${testId}, UserID: ${session.user.id}`
			)

			// Check if the test was already completed
			const completedTest = await prisma.assignedTest.findFirst({
				where: {
					OR: [{ id: testId }, { testId: testId }],
					userId: session.user.id,
					completedAt: { not: null }
				}
			})

			if (completedTest) {
				console.log(
					`Test already completed. TestID/AssignedTestID: ${testId}, UserID: ${session.user.id}`
				)
				return NextResponse.json(
					{
						error: 'Test already completed',
						testId,
						userId: session.user.id
					},
					{ status: 400 }
				)
			}

			// If not completed, it's truly not found
			return NextResponse.json(
				{ error: 'Test not found', testId, userId: session.user.id },
				{ status: 404 }
			)
		}

		// Check if the test is already completed
		if (assignedTest.completedAt) {
			console.log(
				`Test already completed. AssignedTestID: ${assignedTest.id}, UserID: ${session.user.id}`
			)
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
		console.log('Calculated score:', score)

		const updatedAssignedTest = await prisma.assignedTest.update({
			where: { id: assignedTest.id },
			data: {
				completedAt: new Date(),
				score: score,
				answers: answers // Assuming you want to store the answers
			}
		})
		console.log(
			'Updated assignedTest:',
			JSON.stringify(updatedAssignedTest, null, 2)
		)

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
		if (question.correctAnswer === parseInt(answers[index])) {
			correctAnswers++
		}
	})
	return Math.round((correctAnswers / questions.length) * 100)
}
