// app/api/skill-personality-test/results/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import prisma from '@/lib/prismadb'

export const dynamic = 'force-dynamic'

export async function GET(request) {
	try {
		const session = await getServerSession(authOptions)
		if (!session) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		let results
		if (session.user.role === 'admin') {
			// Admins can see all test results
			results = await prisma.assignedSkillPersonalityTest.findMany({
				where: { completedAt: { not: null } },
				include: {
					user: {
						select: {
							id: true,
							email: true
						}
					},
					test: {
						select: {
							id: true,
							title: true
						}
					}
				},
				orderBy: { completedAt: 'desc' }
			})
		} else {
			// Regular users can only see their own test results
			results = await prisma.assignedSkillPersonalityTest.findMany({
				where: {
					userId: session.user.id,
					completedAt: { not: null }
				},
				include: {
					user: {
						select: {
							id: true,
							email: true
						}
					},
					test: {
						select: {
							id: true,
							title: true
						}
					}
				},
				orderBy: { completedAt: 'desc' }
			})
		}

		// Process results to include scores and other relevant information
		const processedResults = results.map((result) => ({
			id: result.id,
			testId: result.testId,
			testTitle: result.test.title,
			completedAt: result.completedAt,
			userEmail: result.user.email, // Always include the user email
			scores: result.results
				? {
						iqScore: result.results.iqScore,
						practicalScore: result.results.practicalScore,
						sharpScore: result.results.sharpScore,
						personalityScore: result.results.personalityScore // Add personality score
				  }
				: null
		}))

		return NextResponse.json({ results: processedResults })
	} catch (error) {
		console.error(
			'Error in GET /api/skill-personality-test/results:',
			error
		)
		return NextResponse.json(
			{
				error: 'Failed to fetch test results',
				details: error.message
			},
			{ status: 500 }
		)
	}
}
