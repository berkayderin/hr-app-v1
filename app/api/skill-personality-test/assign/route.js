// app/api/skill-personality-test/assign/route.js

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import prisma from '@/lib/prismadb'

export async function POST(request) {
	try {
		// Kullanıcı oturumunun kontrol edilmesi
		const session = await getServerSession(authOptions)
		if (!session || session.user.role !== 'admin') {
			return NextResponse.json(
				{ error: 'Yetkisiz erişim' },
				{ status: 401 }
			)
		}

		const body = await request.json()
		const { testId, userIds } = body

		if (
			!testId ||
			!userIds ||
			!Array.isArray(userIds) ||
			userIds.length === 0
		) {
			return NextResponse.json(
				{ error: 'Geçersiz giriş verisi' },
				{ status: 400 }
			)
		}

		// Testin var olup olmadığının kontrol edilmesi
		const test = await prisma.skillPersonalityTest.findUnique({
			where: { id: testId }
		})

		if (!test) {
			return NextResponse.json(
				{ error: 'Test bulunamadı' },
				{ status: 404 }
			)
		}

		// Testin her kullanıcıya atanması
		const assignments = await Promise.all(
			userIds.map(async (userId) => {
				try {
					// Kullanıcının var olup olmadığının kontrol edilmesi
					const user = await prisma.user.findUnique({
						where: { id: userId }
					})

					if (!user) {
						return { userId, error: 'Kullanıcı bulunamadı' }
					}

					// Testin kullanıcıya zaten atanıp atanmadığının kontrol edilmesi
					const existingAssignment =
						await prisma.assignedSkillPersonalityTest.findFirst({
							where: {
								userId: userId,
								testId: testId,
								completedAt: null
							}
						})

					if (existingAssignment) {
						return {
							userId,
							error: 'Test zaten kullanıcıya atanmış'
						}
					}

					// Testin atanması
					const assignedTest =
						await prisma.assignedSkillPersonalityTest.create({
							data: {
								userId,
								testId,
								timeRemaining: 60 * 60 // 60 dakika (saniye cinsinden)
							}
						})

					return { userId, assignedTest }
				} catch (error) {
					console.error(
						`${userId} ID'li kullanıcıya test atanırken hata oluştu:`,
						error
					)
					return { userId, error: 'Test atama başarısız oldu' }
				}
			})
		)

		// Başarılı ve başarısız atamaların ayrıştırılması
		const successfulAssignments = assignments.filter((a) => !a.error)
		const failedAssignments = assignments.filter((a) => a.error)

		return NextResponse.json({
			successfulAssignments,
			failedAssignments,
			message: `${successfulAssignments.length} kullanıcıya başarıyla atandı. ${failedAssignments.length} kullanıcı için başarısız oldu.`
		})
	} catch (error) {
		console.error(
			'/api/skill-personality-test/assign işleminde hata:',
			error
		)

		return NextResponse.json(
			{ error: 'Test atama başarısız oldu', details: error.message },
			{ status: 500 }
		)
	}
}
