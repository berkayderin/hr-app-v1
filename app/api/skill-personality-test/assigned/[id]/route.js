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
			console.log('Yetkisiz erişim girişimi')
			return NextResponse.json(
				{ error: 'Yetkisiz erişim' },
				{ status: 401 }
			)
		}

		const { id } = params
		console.log('Atanmış test getiriliyor, ID:', id)

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

		console.log(
			'Atanmış test bulundu:',
			assignedTest ? 'Evet' : 'Hayır'
		)

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

		console.log('Yanıt gönderiliyor:', response)

		return NextResponse.json(response)
	} catch (error) {
		console.error(
			'GET /api/skill-personality-test/assigned/[id] işleminde hata:',
			error
		)
		return NextResponse.json(
			{ error: 'Test getirme başarısız', details: error.message },
			{ status: 500 }
		)
	}
}
