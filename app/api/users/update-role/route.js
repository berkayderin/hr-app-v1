// app/api/users/update-role/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import prisma from '@/lib/prismadb'

export async function POST(req) {
	try {
		const session = await getServerSession(authOptions)

		if (!session || session.user.role !== 'admin') {
			return new NextResponse('Unauthorized', { status: 401 })
		}

		const { userId, newRole } = await req.json()

		if (!userId || !newRole) {
			return new NextResponse('Missing required fields', {
				status: 400
			})
		}

		const updatedUser = await prisma.user.update({
			where: { id: userId },
			data: { role: newRole }
		})

		return NextResponse.json(updatedUser)
	} catch (error) {
		console.error('Error updating user role:', error)
		return new NextResponse('Internal Server Error', { status: 500 })
	}
}
