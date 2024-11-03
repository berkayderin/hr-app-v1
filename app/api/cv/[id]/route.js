// app/api/cv/[id]/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import prisma from '@/lib/prismadb'

export async function DELETE(request, { params: { id } }) {
	try {
		const session = await getServerSession(authOptions)

		if (!session?.user?.id || session?.user?.role !== 'admin') {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		await prisma.cvEvaluation.delete({
			where: {
				id: id
			}
		})

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('CV delete error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
