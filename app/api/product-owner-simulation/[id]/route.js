// app/api/product-owner-simulation/[id]/route.js
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

		const { id } = params
		if (!id || id === 'undefined') {
			return NextResponse.json(
				{ error: 'Invalid simulation ID' },
				{ status: 400 }
			)
		}

		const simulation = await prisma.productOwnerSimulation.findUnique(
			{
				where: { id }
			}
		)

		if (!simulation || simulation.userId !== session.user.id) {
			return NextResponse.json(
				{ error: 'Not found' },
				{ status: 404 }
			)
		}

		return NextResponse.json(simulation)
	} catch (error) {
		return NextResponse.json(
			{ error: 'Internal server error', details: error.message },
			{ status: 500 }
		)
	}
}
