// app/api/skill-personality-test/assigned/[id]/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import prisma from '@/lib/prismadb'

export const dynamic = 'force-dynamic'

export async function GET(request, { params }) {
	try {
		const session = await getServerSession(authOptions)
		if (!session) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const { id } = params
		const assignedTest =
			await prisma.assignedSkillPersonalityTest.findUnique({
				where: {
					id: id,
					userId: session.user.id
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

		return NextResponse.json({
			test: assignedTest.test,
			timeRemaining: assignedTest.timeRemaining
		})
	} catch (error) {
		console.error(
			'Error in GET /api/skill-personality-test/assigned/[id]:',
			error
		)
		return NextResponse.json(
			{ error: 'Failed to fetch test', details: error.message },
			{ status: 500 }
		)
	}
}
