// app/api/skill-personality-test/assigned/[id]/route.js

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import prisma from '@/lib/prismadb'

export const dynamic = 'force-dynamic'

export async function GET(request, { params }) {
	try {
		const session = await getServerSession(authOptions)
		if (!session) {
			return NextResponse.json(
				{ error: 'Yetkisiz erişim' },
				{ status: 401 }
			)
		}

		const { id } = params

		const assignedTest =
			await prisma.assignedSkillPersonalityTest.findUnique({
				where: {
					id: id,
					userId: session.user.id
				},
				include: {
					test: true
				}
			})

		if (!assignedTest) {
			console.log('Test bulunamadı veya kullanıcıya atanmamış')
			return NextResponse.json(
				{ error: 'Test bulunamadı veya kullanıcıya atanmamış' },
				{ status: 404 }
			)
		}

		const response = {
			id: assignedTest.id,
			test: assignedTest.test,
			timeRemaining: assignedTest.timeRemaining
		}

		return NextResponse.json(response)
	} catch (error) {
		return NextResponse.json(
			{ error: 'Test getirme başarısız', details: error.message },
			{ status: 500 }
		)
	}
}
