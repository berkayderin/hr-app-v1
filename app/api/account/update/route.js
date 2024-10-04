// app/api/account/update/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import prisma from '@/lib/prismadb'
import bcrypt from 'bcrypt'

export async function POST(req) {
	try {
		const session = await getServerSession(authOptions)

		if (!session || !session.user) {
			return NextResponse.json(
				{ message: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const { email, currentPassword, newPassword } = await req.json()

		const user = await prisma.user.findUnique({
			where: { email: session.user.email }
		})

		if (!user) {
			return NextResponse.json(
				{ message: 'User not found' },
				{ status: 404 }
			)
		}

		const isPasswordValid = await bcrypt.compare(
			currentPassword,
			user.hashedPassword
		)

		if (!isPasswordValid) {
			return NextResponse.json(
				{ message: 'Invalid current password' },
				{ status: 400 }
			)
		}

		const updates = {
			email: email
		}

		if (newPassword) {
			const hashedPassword = await bcrypt.hash(newPassword, 12)
			updates.hashedPassword = hashedPassword
		}

		const updatedUser = await prisma.user.update({
			where: { id: user.id },
			data: updates
		})

		return NextResponse.json({
			message: 'Account updated successfully'
		})
	} catch (error) {
		console.error('Error updating account:', error)
		return NextResponse.json(
			{ message: `Internal Server Error: ${error.message}` },
			{ status: 500 }
		)
	}
}
