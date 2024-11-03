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

		const processedResults = results.map((result) => ({
			id: result.id,
			testId: result.testId,
			testTitle: result.test.title,
			completedAt: result.completedAt,
			userEmail: result.user.email,
			scores: result.results
				? {
						iqScore: result.results.iqScore,
						practicalScore: result.results.practicalScore,
						sharpScore: result.results.sharpScore,
						personalityScore: result.results.personalityScore,
						departmentCompatibility:
							result.results.departmentCompatibility
				  }
				: null
		}))

		return NextResponse.json({ results: processedResults })
	} catch (error) {
		return NextResponse.json(
			{
				error: 'Failed to fetch test results',
				details: error.message
			},
			{ status: 500 }
		)
	}
}
