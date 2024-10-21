// app/api/product-owner-simulation/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import prisma from '@/lib/prismadb'

export async function POST(request) {
	const session = await getServerSession(authOptions)
	if (!session) {
		return NextResponse.json(
			{ error: 'Unauthorized' },
			{ status: 401 }
		)
	}

	const simulation = await prisma.productOwnerSimulation.create({
		data: {
			userId: session.user.id,
			currentTask: 'teamMeeting'
		}
	})

	return NextResponse.json(simulation)
}
