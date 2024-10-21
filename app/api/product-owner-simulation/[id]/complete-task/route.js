// app/api/product-owner-simulation/[id]/complete-task/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import prisma from '@/lib/prismadb'

export async function POST(request, { params }) {
	try {
		console.log('Received request:', request)
		console.log('Params:', params)

		const session = await getServerSession(authOptions)
		console.log('Session:', session)

		if (!session) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const { taskData } = await request.json()
		console.log('Task data:', taskData)

		const simulation = await prisma.productOwnerSimulation.findUnique(
			{
				where: { id: params.id }
			}
		)
		console.log('Found simulation:', simulation)

		if (!simulation || simulation.userId !== session.user.id) {
			return NextResponse.json(
				{ error: 'Not found' },
				{ status: 404 }
			)
		}

		let nextTask
		let completed = false
		switch (simulation.currentTask) {
			case 'teamMeeting':
				nextTask = 'backlogPrioritization'
				break
			case 'backlogPrioritization':
				nextTask = 'userStoryWriting'
				break
			case 'userStoryWriting':
				nextTask = null
				completed = true
				break
			default:
				return NextResponse.json(
					{ error: 'Invalid task' },
					{ status: 400 }
				)
		}

		console.log('Next task:', nextTask)
		console.log('Completed:', completed)

		const updatedSimulation =
			await prisma.productOwnerSimulation.update({
				where: { id: params.id },
				data: {
					[simulation.currentTask]: taskData,
					currentTask: nextTask,
					completedAt: completed ? new Date() : undefined,
					score: completed
						? calculateScore(simulation, taskData)
						: undefined
				}
			})
		console.log('Updated simulation:', updatedSimulation)

		return NextResponse.json({ ...updatedSimulation, completed })
	} catch (error) {
		console.error('Error in complete-task API:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error', details: error.message },
			{ status: 500 }
		)
	}
}

function calculateScore(simulation, taskData) {
	let score = 0

	// Takım Toplantısı değerlendirmesi
	if (simulation.teamMeeting && simulation.teamMeeting.teamMeeting) {
		const correctAnswers = [2, 1, 3, 0] // Doğru cevapların indeksleri
		Object.entries(simulation.teamMeeting.teamMeeting).forEach(
			([questionIndex, answer], index) => {
				if (parseInt(answer) === correctAnswers[index]) {
					score += 25 // Her doğru cevap için 25 puan
				}
			}
		)
	}

	// Backlog Önceliklendirme değerlendirmesi
	if (
		simulation.backlogPrioritization &&
		simulation.backlogPrioritization.backlogPrioritization
	) {
		const backlogItems =
			simulation.backlogPrioritization.backlogPrioritization
		if (Array.isArray(backlogItems)) {
			const correctOrder = ['item1', 'item2', 'item3']
			const userOrder = backlogItems.map((item) => item.id)
			let orderScore = 0
			for (let i = 0; i < correctOrder.length; i++) {
				if (correctOrder[i] === userOrder[i]) {
					orderScore += 1
				}
			}
			score += (orderScore / correctOrder.length) * 100
		}
	}

	// Kullanıcı Hikayesi Yazma değerlendirmesi
	if (taskData && taskData.userStoryWriting) {
		const story = taskData.userStoryWriting
		if (story.asA && story.iWantTo && story.soThat) {
			score += 50 // Temel yapı için 50 puan
		}
		if (
			story.acceptanceCriteria &&
			story.acceptanceCriteria.length > 50
		) {
			score += 50 // Detaylı kabul kriterleri için 50 puan
		}
	}

	return Math.round(score / 3) // Toplam puanı 3'e bölerek ortalama al
}
