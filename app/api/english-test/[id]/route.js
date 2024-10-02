// app/api/english-test/[id]/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import prisma from '@/lib/prismadb'

export async function GET(request, { params }) {
	try {
		const session = await getServerSession(authOptions)
		if (!session) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const assignedTest = await prisma.assignedTest.findFirst({
			where: {
				testId: params.id,
				userId: session.user.id,
				completedAt: null
			},
			include: {
				test: true
			}
		})

		if (!assignedTest) {
			return NextResponse.json(
				{ error: 'Test not found or not assigned to user' },
				{ status: 404 }
			)
		}

		// timeRemaining değerini AssignedTest modelinden alıyoruz
		const testData = {
			...assignedTest.test,
			timeRemaining: assignedTest.timeRemaining
		}

		return NextResponse.json(testData)
	} catch (error) {
		console.error('Error in /api/english-test/[id]:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch test', details: error.message },
			{ status: 500 }
		)
	}
}
