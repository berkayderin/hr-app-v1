// app/api/product-owner-simulation/[id]/complete-task/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import prisma from '@/lib/prismadb'

export async function POST(request, { params }) {
	try {
		const session = await getServerSession(authOptions)
		if (!session) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const { id } = params
		if (!id || id === 'undefined') {
			return NextResponse.json(
				{ error: 'Invalid simulation ID' },
				{ status: 400 }
			)
		}

		const { taskData } = await request.json()

		const simulation = await prisma.productOwnerSimulation.findUnique(
			{
				where: { id }
			}
		)

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

		const updatedSimulation =
			await prisma.productOwnerSimulation.update({
				where: { id },
				data: {
					[simulation.currentTask]: taskData,
					currentTask: nextTask,
					completedAt: completed ? new Date() : undefined,
					score: completed
						? calculateScore(simulation, taskData)
						: undefined
				}
			})

		return NextResponse.json({ ...updatedSimulation, completed })
	} catch (error) {
		console.error(
			'Error in POST /api/product-owner-simulation/[id]/complete-task:',
			error
		)
		return NextResponse.json(
			{ error: 'Internal server error', details: error.message },
			{ status: 500 }
		)
	}
}

function calculateScore(simulation, taskData) {
	let score = 0

	// Team Meeting score calculation
	if (
		simulation.teamMeeting &&
		Array.isArray(simulation.teamMeeting)
	) {
		const correctAnswers = simulation.teamMeeting.map(
			(q) => q.correctAnswer
		)
		const userAnswers = Object.values(taskData.teamMeeting)
		score += userAnswers.reduce(
			(sum, answer, index) =>
				sum + (answer === correctAnswers[index] ? 20 : 0),
			0
		)
	}

	// Backlog Prioritization score calculation
	if (
		simulation.backlogPrioritization &&
		Array.isArray(simulation.backlogPrioritization)
	) {
		const originalOrder = simulation.backlogPrioritization.map(
			(item) => item.id
		)
		const userOrder = taskData.backlogPrioritization.map(
			(item) => item.id
		)
		score += originalOrder.reduce(
			(sum, id, index) => sum + (id === userOrder[index] ? 5 : 0),
			0
		)
	}

	// User Story Writing score calculation
	if (taskData.userStoryWriting) {
		const story = taskData.userStoryWriting
		if (story.asA && story.iWantTo && story.soThat) {
			score += 15
		}
		score += Math.min(
			story.acceptanceCriteria.filter(Boolean).length * 5,
			25
		)
	}

	return score
}
