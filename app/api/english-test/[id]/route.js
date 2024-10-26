// app/api/english-test/[id]/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import prisma from '@/lib/prismadb'

export async function GET(request, { params }) {
	try {
		const session = await getServerSession(authOptions)
		if (!session) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		if (session.user.role === 'admin') {
			// Admin için tam test detayları
			const test = await prisma.englishTest.findUnique({
				where: { id: params.id },
				include: {
					assignedTests: {
						include: {
							user: true
						}
					}
				}
			})

			if (!test) {
				return NextResponse.json(
					{ error: 'Test not found' },
					{ status: 404 }
				)
			}

			return NextResponse.json(test)
		} else {
			// Normal kullanıcı için atanmış test detayları
			const assignedTest = await prisma.assignedTest.findFirst({
				where: {
					testId: params.id,
					userId: session.user.id,
					completedAt: null
				},
				include: {
					test: true
				}
			})

			if (!assignedTest) {
				return NextResponse.json(
					{ error: 'Test not found or not assigned' },
					{ status: 404 }
				)
			}

			return NextResponse.json({
				...assignedTest.test,
				timeRemaining: assignedTest.timeRemaining
			})
		}
	} catch (error) {
		console.error('Error:', error)
		return NextResponse.json(
			{ error: 'Internal server error', details: error.message },
			{ status: 500 }
		)
	}
}

export async function PATCH(request, { params }) {
	try {
		const session = await getServerSession(authOptions)

		if (!session || session.user.role !== 'admin') {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const body = await request.json()
		const { questionIndex, newCorrectAnswer } = body

		// Önce mevcut testi alalım
		const currentTest = await prisma.englishTest.findUnique({
			where: { id: params.id },
			include: {
				assignedTests: {
					include: {
						user: true
					}
				}
			}
		})

		if (!currentTest) {
			return NextResponse.json(
				{ error: 'Test not found' },
				{ status: 404 }
			)
		}

		// Questions array'ini güncelleyelim
		const updatedQuestions = [...currentTest.questions]
		updatedQuestions[questionIndex].correctAnswer = newCorrectAnswer

		// Testi güncelleyelim
		const updatedTest = await prisma.englishTest.update({
			where: { id: params.id },
			data: {
				questions: updatedQuestions
			},
			include: {
				assignedTests: {
					include: {
						user: true
					}
				}
			}
		})

		return NextResponse.json(updatedTest)
	} catch (error) {
		console.error('Error updating test:', error)
		return NextResponse.json(
			{ error: 'Failed to update test', details: error.message },
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
		await prisma.assignedTest.deleteMany({
			where: { testId: params.id }
		})

		// Sonra testin kendisini silelim
		const deletedTest = await prisma.englishTest.delete({
			where: { id: params.id }
		})

		return NextResponse.json(deletedTest)
	} catch (error) {
		console.error('Error in DELETE /api/english-test/[id]:', error)
		return NextResponse.json(
			{ error: 'Failed to delete test', details: error.message },
			{ status: 500 }
		)
	}
}
