// app/api/skill-personality-test/assign/route.js
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

		const body = await request.json()
		const { testId, userIds } = body

		if (
			!testId ||
			!userIds ||
			!Array.isArray(userIds) ||
			userIds.length === 0
		) {
			return NextResponse.json(
				{ error: 'Invalid input data' },
				{ status: 400 }
			)
		}

		// Check if the test exists
		const test = await prisma.skillPersonalityTest.findUnique({
			where: { id: testId }
		})

		if (!test) {
			return NextResponse.json(
				{ error: 'Test not found' },
				{ status: 404 }
			)
		}

		// Assign the test to each user
		const assignments = await Promise.all(
			userIds.map(async (userId) => {
				try {
					// Check if the user exists
					const user = await prisma.user.findUnique({
						where: { id: userId }
					})

					if (!user) {
						return { userId, error: 'User not found' }
					}

					// Check if the test is already assigned to the user
					const existingAssignment =
						await prisma.assignedSkillPersonalityTest.findFirst({
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
					const assignedTest =
						await prisma.assignedSkillPersonalityTest.create({
							data: {
								userId,
								testId,
								timeRemaining: 60 * 60 // 60 minutes in seconds
							}
						})

					return { userId, assignedTest }
				} catch (error) {
					console.error(
						`Error assigning test to user ${userId}:`,
						error
					)
					return { userId, error: 'Failed to assign test' }
				}
			})
		)

		const successfulAssignments = assignments.filter((a) => !a.error)
		const failedAssignments = assignments.filter((a) => a.error)

		return NextResponse.json({
			successfulAssignments,
			failedAssignments,
			message: `Successfully assigned to ${successfulAssignments.length} users. Failed for ${failedAssignments.length} users.`
		})
	} catch (error) {
		console.error(
			'Error in /api/skill-personality-test/assign:',
			error
		)
		return NextResponse.json(
			{ error: 'Failed to assign test', details: error.message },
			{ status: 500 }
		)
	}
}
