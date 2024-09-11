import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import prisma from '@/lib/prismadb'
import bcrypt from 'bcrypt'

export async function POST(req) {
	try {
		const session = await getServerSession(authOptions)

		if (!session) {
			return new NextResponse('Unauthorized', { status: 401 })
		}

		const { email, currentPassword, newPassword } = await req.json()

		const user = await prisma.user.findUnique({
			where: { id: session.user.id }
		})

		if (!user) {
			return new NextResponse('User not found', { status: 404 })
		}

		const isPasswordValid = await bcrypt.compare(
			currentPassword,
			user.hashedPassword
		)

		if (!isPasswordValid) {
			return new NextResponse('Invalid current password', {
				status: 400
			})
		}

		const updates = {
			email: email
		}

		if (newPassword) {
			const hashedPassword = await bcrypt.hash(newPassword, 12)
			updates.hashedPassword = hashedPassword
		}

		const updatedUser = await prisma.user.update({
			where: { id: session.user.id },
			data: updates
		})

		return NextResponse.json({
			message: 'Account updated successfully'
		})
	} catch (error) {
		console.error('Error updating account:', error)
		return new NextResponse('Internal Server Error', { status: 500 })
	}
}
