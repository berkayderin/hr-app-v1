// app/api/skill-personality-test/submit/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import prisma from '@/lib/prismadb'

export const dynamic = 'force-dynamic'

export async function POST(request) {
	try {
		const session = await getServerSession(authOptions)
		if (!session) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const { testId, answers } = await request.json()

		const assignedTest =
			await prisma.assignedSkillPersonalityTest.findFirst({
				where: {
					id: testId,
					userId: session.user.id,
					completedAt: null
				},
				include: { test: true }
			})

		if (!assignedTest) {
			return NextResponse.json(
				{ error: 'Test not found or already completed' },
				{ status: 404 }
			)
		}

		const results = calculateResults(assignedTest.test, answers)

		const updatedAssignedTest =
			await prisma.assignedSkillPersonalityTest.update({
				where: { id: assignedTest.id },
				data: {
					completedAt: new Date(),
					answers,
					results
				}
			})

		return NextResponse.json(updatedAssignedTest)
	} catch (error) {
		console.error(
			'Error in /api/skill-personality-test/submit:',
			error
		)
		return NextResponse.json(
			{ error: 'Failed to submit test', details: error.message },
			{ status: 500 }
		)
	}
}

function calculateResults(test, answers) {
	const sectionScores = test.sections.map((section, sectionIndex) => {
		const sectionAnswers = Object.entries(answers)
			.filter(([key]) => key.startsWith(`${sectionIndex}-`))
			.map(([, value]) => parseInt(value))

		const score =
			(sectionAnswers.reduce((sum, answer) => sum + answer, 0) /
				sectionAnswers.length) *
			100
		return { title: section.title, score }
	})

	const iqScore =
		sectionScores.find((s) => s.title === 'IQ Test')?.score ?? 0
	const practicalScore =
		sectionScores.find((s) => s.title === 'Practical Intelligence')
			?.score ?? 0
	const sharpScore =
		sectionScores.find((s) => s.title === 'Sharp Intelligence')
			?.score ?? 0
	const personalityScore =
		sectionScores.find((s) => s.title === 'Personality Analysis')
			?.score ?? 0

	const personalityProfile =
		generatePersonalityProfile(personalityScore)
	const departmentCompatibility = generateDepartmentCompatibility(
		iqScore,
		practicalScore,
		sharpScore,
		personalityScore
	)

	return {
		iqScore,
		practicalScore,
		sharpScore,
		personalityScore,
		personalityProfile,
		departmentCompatibility
	}
}

function generatePersonalityProfile(score) {
	if (score > 75) {
		return 'Dışa dönük, yenilikçi ve risk almaya açık bir kişilik profili.'
	} else if (score > 50) {
		return 'Dengeli, uyumlu ve esnek bir kişilik profili.'
	} else {
		return 'İçe dönük, analitik ve detaycı bir kişilik profili.'
	}
}

function generateDepartmentCompatibility(
	iqScore,
	practicalScore,
	sharpScore,
	personalityScore
) {
	const compatibilities = []

	if (iqScore > 70 && sharpScore > 60) {
		compatibilities.push('Ar-Ge Departmanı')
	}
	if (practicalScore > 70 && personalityScore > 60) {
		compatibilities.push('Müşteri İlişkileri Departmanı')
	}
	if (iqScore > 60 && practicalScore > 60 && sharpScore > 60) {
		compatibilities.push('Yönetim Departmanı')
	}
	if (sharpScore > 70 && personalityScore < 50) {
		compatibilities.push('Analiz Departmanı')
	}

	return compatibilities.length > 0
		? compatibilities
		: ['Genel Departmanlar']
}
