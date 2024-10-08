// app/api/skill-personality-test/[id]/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import prisma from '@/lib/prismadb'

export async function GET(request, { params }) {
	try {
		const session = await getServerSession(authOptions)
		if (!session || session.user.role !== 'admin') {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const { id } = params
		const test = await prisma.skillPersonalityTest.findUnique({
			where: { id }
		})

		if (!test) {
			return NextResponse.json(
				{ error: 'Test not found' },
				{ status: 404 }
			)
		}

		return NextResponse.json({ test })
	} catch (error) {
		console.error(
			'Error in GET /api/skill-personality-test/[id]:',
			error
		)
		return NextResponse.json(
			{ error: 'Failed to fetch test', details: error.message },
			{ status: 500 }
		)
	}
}
