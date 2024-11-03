// app/api/skill-personality-test/assign/route.js

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import prisma from '@/lib/prismadb'

export async function POST(request) {
	try {
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

		const test = await prisma.skillPersonalityTest.findUnique({
			where: { id: testId }
		})

		if (!test) {
			return NextResponse.json(
				{ error: 'Test bulunamadı' },
				{ status: 404 }
			)
		}

		const assignments = await Promise.all(
			userIds.map(async (userId) => {
				try {
					const user = await prisma.user.findUnique({
						where: { id: userId }
					})

					if (!user) {
						return { userId, error: 'Kullanıcı bulunamadı' }
					}

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

					const assignedTest =
						await prisma.assignedSkillPersonalityTest.create({
							data: {
								userId,
								testId,
								timeRemaining: 15 * 60 // 15 dakika
							}
						})

					return { userId, assignedTest }
				} catch (error) {
					return { userId, error: 'Test atama başarısız oldu' }
				}
			})
		)

		const successfulAssignments = assignments.filter((a) => !a.error)
		const failedAssignments = assignments.filter((a) => a.error)

		return NextResponse.json({
			successfulAssignments,
			failedAssignments,
			message: `${successfulAssignments.length} kullanıcıya başarıyla atandı. ${failedAssignments.length} kullanıcı için başarısız oldu.`
		})
	} catch (error) {
		return NextResponse.json(
			{ error: 'Test atama başarısız oldu', details: error.message },
			{ status: 500 }
		)
	}
}
