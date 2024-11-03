// app/api/cv/list/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import prisma from '@/lib/prismadb'

export async function GET() {
	try {
		const session = await getServerSession(authOptions)

		if (!session?.user?.id || session?.user?.role !== 'admin') {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const cvList = await prisma.cvEvaluation.findMany({
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				user: {
					select: {
						email: true
					}
				}
			}
		})

		return NextResponse.json(cvList)
	} catch (error) {
		console.error('CV list fetch error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
