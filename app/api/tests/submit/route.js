import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import prisma from '@/lib/prismadb'

export async function POST(req) {
	try {
		const session = await getServerSession(authOptions)

		if (!session) {
			return new NextResponse('Unauthorized', { status: 401 })
		}

		const { testId, userId, answers } = await req.json()

		if (session.user.id !== userId) {
			return new NextResponse('Unauthorized', { status: 401 })
		}

		const test = await prisma.test.findUnique({
			where: { id: testId },
			include: { questions: true }
		})

		if (!test) {
			return new NextResponse('Test not found', { status: 404 })
		}

		// Basit bir puanlama sistemi (doğru cevap sayısı)
		let score = 0
		const answeredQuestions = Object.entries(answers)
		for (let [questionIndex, answer] of answeredQuestions) {
			const questionNumber = parseInt(questionIndex.split('_')[1])
			if (test.questions[questionNumber].correctAnswer === answer) {
				score++
			}
		}

		const result = await prisma.result.create({
			data: {
				user: { connect: { id: userId } },
				test: { connect: { id: testId } },
				score: score,
				answers: answers
			}
		})

		return NextResponse.json({
			message: 'Test submitted successfully',
			result
		})
	} catch (error) {
		console.error('Error submitting test:', error)
		return new NextResponse('Internal Server Error', { status: 500 })
	}
}
