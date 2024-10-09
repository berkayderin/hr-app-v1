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
			console.log('Unauthorized access attempt')
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const { id } = params
		console.log('Fetching assigned test with id:', id)

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

		console.log('Found assigned test:', assignedTest ? 'Yes' : 'No')

		if (!assignedTest) {
			console.log('Test not found or not assigned to user')
			return NextResponse.json(
				{ error: 'Test not found or not assigned to user' },
				{ status: 404 }
			)
		}

		const response = {
			id: assignedTest.id,
			test: assignedTest.test,
			timeRemaining: assignedTest.timeRemaining
		}

		console.log('Sending response:', response)

		return NextResponse.json(response)
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
