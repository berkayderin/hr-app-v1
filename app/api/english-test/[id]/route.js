// app/api/english-test/[id]/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import prisma from '@/lib/prismadb'

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
				testId: params.id,
				userId: session.user.id,
				completedAt: null
			},
			include: {
				test: true,
				user: true
			}
		})
		console.log('AssignedTest found:', assignedTest)

		if (!assignedTest) {
			console.log(
				`Test with ID ${params.id} not found or not assigned to user ${session.user.id}`
			)
			return NextResponse.json(
				{ error: 'Test not found or not assigned' },
				{ status: 404 }
			)
		}

		const testData = {
			...assignedTest.test,
			timeRemaining: assignedTest.timeRemaining
		}

		return NextResponse.json(testData)
	} catch (error) {
		console.error('Error in /api/english-test/[id]:', error)
		return NextResponse.json(
			{ error: 'Internal server error', details: error.message },
			{ status: 500 }
		)
	}
}

export async function DELETE(request, { params }) {
	try {
		const session = await getServerSession(authOptions)

		if (!session || session.user.role !== 'admin') {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		// Önce bu teste ait tüm atanmış testleri silelim
		await prisma.assignedTest.deleteMany({
			where: { testId: params.id }
		})

		// Sonra testin kendisini silelim
		const deletedTest = await prisma.englishTest.delete({
			where: { id: params.id }
		})

		return NextResponse.json(deletedTest)
	} catch (error) {
		console.error('Error in DELETE /api/english-test/[id]:', error)
		return NextResponse.json(
			{ error: 'Failed to delete test', details: error.message },
			{ status: 500 }
		)
	}
}
