// app/api/english-test/assigned/[id]/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import prisma from '@/lib/prismadb'

export const dynamic = 'force-dynamic'

export async function GET(request, { params }) {
	console.log('API route called with params:', params)
	try {
		const session = await getServerSession(authOptions)
		console.log('Session:', session)
		if (!session) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const assignedTest = await prisma.assignedTest.findFirst({
			where: {
				id: params.id,
				userId: session.user.id
			},
			include: { test: true }
		})

		console.log('AssignedTest ID:', params.id)
		console.log('User ID:', session.user.id)
		console.log('Query result:', assignedTest)
		console.log('Database query result:', assignedTest)

		if (!assignedTest) {
			console.log(
				`AssignedTest not found. ID: ${params.id}, User ID: ${session.user.id}`
			)
			return NextResponse.json(
				{
					error: 'Test not found or not assigned',
					details: { id: params.id, userId: session.user.id }
				},
				{ status: 404 }
			)
		}

		const testData = {
			test: assignedTest.test,
			timeRemaining: assignedTest.timeRemaining
		}

		return NextResponse.json(testData)
	} catch (error) {
		console.error('Error in /api/english-test/assigned/[id]:', error)
		return NextResponse.json(
			{ error: 'Internal server error', details: error.message },
			{ status: 500 }
		)
	}
}
