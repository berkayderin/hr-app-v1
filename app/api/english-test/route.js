import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import prisma from '@/lib/prismadb'

export async function GET() {
	try {
		const session = await getServerSession(authOptions)

		if (!session) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		let tests = []
		if (session.user.role === 'admin') {
			tests = await prisma.englishTest.findMany({
				orderBy: { createdAt: 'desc' },
				include: {
					assignedTests: {
						where: { completedAt: null },
						select: { id: true }
					}
				}
			})
			tests = tests.map((test) => ({
				...test,
				assignedTestId: test.assignedTests[0]?.id
			}))
		} else {
			const assignedTests = await prisma.assignedTest.findMany({
				where: {
					userId: session.user.id
				},
				include: {
					test: true
				},
				orderBy: { assignedAt: 'desc' }
			})
			tests = assignedTests.map((at) => ({
				...at.test,
				assignedTestId: at.id,
				completedAt: at.completedAt
			}))
		}

		return NextResponse.json({
			tests,
			userRole: session.user.role
		})
	} catch (error) {
		console.error('Error fetching tests:', error)
		return NextResponse.json(
			{ error: 'Internal server error', details: error.message },
			{ status: 500 }
		)
	}
}
