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

		if (!prisma || !prisma.assignedTest) {
			throw new Error('Prisma client is not initialized properly')
		}

		const assignedTest = await prisma.assignedTest.create({
			data: {
				userId,
				testId,
				timeRemaining: 20 * 60 // 20 minutes in seconds
			}
		})

		return NextResponse.json(assignedTest)
	} catch (error) {
		console.error('Error in /api/english-test/assign:', error)
		return NextResponse.json(
			{ error: 'Failed to assign test', details: error.message },
			{ status: 500 }
		)
	}
}
