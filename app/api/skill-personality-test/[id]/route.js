// app/api/skill-personality-test/[id]/route.js

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import prisma from '@/lib/prismadb'

export async function GET(request, { params }) {
	try {
		// Kullanıcı oturumunun kontrol edilmesi
		const session = await getServerSession(authOptions)
		if (!session || session.user.role !== 'admin') {
			return NextResponse.json(
				{ error: 'Yetkisiz erişim' },
				{ status: 401 }
			)
		}

		const { id } = params
		// Veritabanından belirtilen ID'ye sahip testin bulunması
		const test = await prisma.skillPersonalityTest.findUnique({
			where: { id },
			include: {
				_count: {
					select: { assignedTests: true }
				},
				assignedTests: {
					include: {
						user: true // user bilgileri de döndürülüyor
					}
				}
			}
		})

		if (!test) {
			return NextResponse.json(
				{ error: 'Test bulunamadı' },
				{ status: 404 }
			)
		}

		return NextResponse.json({
			test: {
				...test,
				assignmentCount: test._count.assignedTests
			}
		})
	} catch (error) {
		console.error(
			'GET /api/skill-personality-test/[id] işleminde hata:',
			error
		)

		return NextResponse.json(
			{ error: 'Test getirme başarısız', details: error.message },
			{ status: 500 }
		)
	}
}

export async function DELETE(request, { params }) {
	try {
		const session = await getServerSession(authOptions)

		if (!session || session.user.role !== 'admin') {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		// Önce bu teste ait tüm atanmış testleri silelim
		await prisma.assignedSkillPersonalityTest.deleteMany({
			where: { testId: params.id }
		})

		// Sonra testin kendisini silelim
		const deletedTest = await prisma.skillPersonalityTest.delete({
			where: { id: params.id }
		})

		return NextResponse.json(deletedTest)
	} catch (error) {
		console.error(
			'Error in DELETE /api/skill-personality-test/[id]:',
			error
		)
		return NextResponse.json(
			{ error: 'Failed to delete test', details: error.message },
			{ status: 500 }
		)
	}
}
