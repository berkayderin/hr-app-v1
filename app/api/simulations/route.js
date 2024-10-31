// app/api/simulations/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import prisma from '@/lib/prismadb'

export async function GET(request) {
	try {
		const session = await getServerSession(authOptions)

		if (!session || !session.user || session.user.role !== 'admin') {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const productOwnerSimulations =
			await prisma.productOwnerSimulation.findMany({
				include: {
					user: {
						select: {
							email: true
						}
					}
				},
				orderBy: {
					completedAt: 'desc'
				}
			})

		const formattedSimulations = productOwnerSimulations.map(
			(simulation) => ({
				id: simulation.id,
				type: 'Product Owner',
				candidateEmail: simulation.user.email,
				startedAt: simulation.startedAt,
				completedAt: simulation.completedAt,
				score: simulation.score,
				details: {
					teamMeeting: simulation.teamMeeting
						? getTeamMeetingDetails(simulation.teamMeeting)
						: null,
					backlogPrioritization: simulation.backlogPrioritization
						? getBacklogDetails(simulation.backlogPrioritization)
						: null,
					userStory: simulation.userStoryWriting
						? getUserStoryDetails(simulation.userStoryWriting)
						: null
				},
				taskScores: {
					teamMeeting: calculateTeamMeetingScore(
						simulation.teamMeeting
					),
					backlogPrioritization: calculateBacklogScore(
						simulation.backlogPrioritization
					),
					userStory: calculateUserStoryScore(
						simulation.userStoryWriting
					)
				},
				status: getSimulationStatus(simulation)
			})
		)

		return NextResponse.json(formattedSimulations)
	} catch (error) {
		console.error('Error in simulations API:', error)
		return NextResponse.json(
			{ error: 'Internal server error', details: error.message },
			{ status: 500 }
		)
	}
}

function getTeamMeetingDetails(teamMeeting) {
	if (!teamMeeting || !teamMeeting.teamMeeting) return null
	return {
		questionsAnswered: Object.keys(teamMeeting.teamMeeting).length,
		correctAnswers: Object.values(teamMeeting.teamMeeting).filter(
			Boolean
		).length
	}
}

function getBacklogDetails(backlog) {
	if (!backlog || !backlog.backlogPrioritization) return null
	return {
		itemsOrdered: backlog.backlogPrioritization.length,
		priorityAlignment: calculatePriorityAlignment(
			backlog.backlogPrioritization
		)
	}
}

function getUserStoryDetails(userStory) {
	if (!userStory || !userStory.userStoryWriting) return null
	const story = userStory.userStoryWriting
	return {
		hasUserRole: Boolean(story.asA),
		hasAction: Boolean(story.iWantTo),
		hasBenefit: Boolean(story.soThat),
		acceptanceCriteria: story.acceptanceCriteria.filter(
			(c) => c && c.trim()
		).length
	}
}

function calculateTeamMeetingScore(teamMeeting) {
	if (!teamMeeting || !teamMeeting.teamMeeting) return 0
	const answers = Object.values(teamMeeting.teamMeeting)
	return Math.round(
		(answers.filter(Boolean).length / answers.length) * 100
	)
}

function calculateBacklogScore(backlog) {
	if (!backlog || !backlog.backlogPrioritization) return 0
	const items = backlog.backlogPrioritization
	let score = 0

	items.forEach((item, index) => {
		const priorityDiff = Math.abs(item.priority - (index + 1))
		score += Math.max(0, 10 - priorityDiff)
	})

	return Math.round((score / (items.length * 10)) * 100)
}

function calculateUserStoryScore(userStory) {
	if (!userStory || !userStory.userStoryWriting) return 0
	const story = userStory.userStoryWriting
	let score = 0

	if (story.asA) score += 20
	if (story.iWantTo) score += 20
	if (story.soThat) score += 20

	const criteriaScore = Math.min(
		story.acceptanceCriteria.filter((c) => c && c.trim()).length * 8,
		40
	)
	score += criteriaScore

	return score
}

function calculatePriorityAlignment(items) {
	let alignment = 0
	items.forEach((item, index) => {
		if (item.priority === index + 1) alignment++
	})
	return Math.round((alignment / items.length) * 100)
}

function getSimulationStatus(simulation) {
	if (simulation.completedAt) return 'Tamamlandı'
	if (simulation.startedAt) return 'Devam Ediyor'
	return 'Başlamadı'
}
