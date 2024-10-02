import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import prisma from '@/lib/prismadb'

export async function POST(req) {
	try {
		const session = await getServerSession(authOptions)

		if (!session || session.user.role !== 'admin') {
			return NextResponse.json(
				{ message: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const { userId } = await req.json()

		if (!userId) {
			return NextResponse.json(
				{ message: 'User ID is required' },
				{ status: 400 }
			)
		}

		await prisma.user.delete({
			where: { id: userId }
		})

		return NextResponse.json({ message: 'User deleted successfully' })
	} catch (error) {
		console.error('Error deleting user:', error)
		return NextResponse.json(
			{ message: 'Failed to delete user' },
			{ status: 500 }
		)
	}
}
