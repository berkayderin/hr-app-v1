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

		const { testId, userIds } = await request.json()

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

		// Process each user
		const results = await Promise.all(
			userIds.map(async (userId) => {
				// Check if the user exists
				const user = await prisma.user.findUnique({
					where: { id: userId }
				})

				if (!user) {
					return { userId, error: 'User not found' }
				}

				// Check if the test is already assigned to the user
				const existingAssignment =
					await prisma.assignedTest.findFirst({
						where: {
							userId: userId,
							testId: testId,
							completedAt: null
						}
					})

				if (existingAssignment) {
					return {
						userId,
						error: 'Test already assigned to the user'
					}
				}

				// Assign the test
				const assignedTest = await prisma.assignedTest.create({
					data: {
						userId,
						testId,
						timeRemaining: 20 * 60 // 20 minutes in seconds
					}
				})

				console.log(
					'Test atandı. Test ID:',
					testId,
					'Kullanıcı ID:',
					userId
				)
				return { userId, success: true, assignedTest }
			})
		)

		const successfulAssignments = results.filter(
			(result) => result.success
		)
		const failedAssignments = results.filter((result) => result.error)

		return NextResponse.json({
			successfulAssignments,
			failedAssignments
		})
	} catch (error) {
		console.error('Error in /api/english-test/assign:', error)
		return NextResponse.json(
			{ error: 'Failed to assign test', details: error.message },
			{ status: 500 }
		)
	}
}
