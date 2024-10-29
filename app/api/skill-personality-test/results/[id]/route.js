// app/api/skill-personality-test/results/[id]/route.js
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

		const assignedTest =
			await prisma.assignedSkillPersonalityTest.findUnique({
				where: { id: params.id },
				include: { test: true }
			})

		if (!assignedTest || assignedTest.userId !== session.user.id) {
			return NextResponse.json(
				{ error: 'Test results not found' },
				{ status: 404 }
			)
		}

		if (!assignedTest.completedAt) {
			return NextResponse.json(
				{ error: 'Test not completed yet' },
				{ status: 400 }
			)
		}

		return NextResponse.json(assignedTest.results)
	} catch (error) {
		console.error(
			'Error in /api/skill-personality-test/results/[id]:',
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
