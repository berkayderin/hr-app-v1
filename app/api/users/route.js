// app/api/users/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import prisma from '@/lib/prismadb'

export async function GET(request) {
	try {
		const session = await getServerSession(authOptions)
		if (!session || session.user.role !== 'admin') {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const users = await prisma.user.findMany({
			where: { role: 'user' },
			select: { id: true, email: true }
		})

		return NextResponse.json(users)
	} catch (error) {
		console.error('Error in /api/users:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch users', details: error.message },
			{ status: 500 }
		)
	}
}
