// app/api/english-test/assign/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import prisma from '@/lib/prismadb'

export async function POST(request) {
	try {
		const session = await getServerSession(authOptions)
		if (!session || session.user.role !== 'admin') {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const { testId, userId } = await request.json()

		// Check if the test exists
		const test = await prisma.englishTest.findUnique({
			where: { id: testId }
		})

		if (!test) {
			return NextResponse.json(
				{ error: 'Test not found' },
				{ status: 404 }
			)
		}

		// Check if the user exists
		const user = await prisma.user.findUnique({
			where: { id: userId }
		})

		if (!user) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 }
			)
		}

		// Check if the test is already assigned to the user
		const existingAssignment = await prisma.assignedTest.findFirst({
			where: {
				userId: userId,
				testId: testId,
				completedAt: null
			}
		})

		if (existingAssignment) {
			return NextResponse.json(
				{ error: 'Test already assigned to the user' },
				{ status: 400 }
			)
		}

		const assignedTest = await prisma.assignedTest.create({
			data: {
				userId,
				testId,
				timeRemaining: 20 * 60 // 20 minutes in seconds
			}
		})

		console.log(
			'Test atanıyor. Test ID:',
			testId,
			'Kullanıcı ID:',
			userId
		)
		console.log('AssignedTest oluşturuldu:', assignedTest)

		return NextResponse.json(assignedTest)
	} catch (error) {
		console.error('Error in /api/english-test/assign:', error)
		return NextResponse.json(
			{ error: 'Failed to assign test', details: error.message },
			{ status: 500 }
		)
	}
}
