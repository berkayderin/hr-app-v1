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
		console.log('Received payload:', { testId, answers })
		console.log('User ID from session:', session.user.id)

		// Test ID'sine göre atanmış testin bulunması
		let assignedTest =
			await prisma.assignedSkillPersonalityTest.findFirst({
				where: {
					OR: [{ id: testId }, { testId: testId }],
					userId: session.user.id
				},
				include: { test: true }
			})

		console.log('Found assigned test:', assignedTest)

		if (!assignedTest) {
			// Bu kullanıcı için atanmış tüm testlerin loglanması
			const allAssignedTests =
				await prisma.assignedSkillPersonalityTest.findMany({
					where: { userId: session.user.id },
					select: { id: true, testId: true }
				})
			console.log('All assigned tests for user:', allAssignedTests)

			return NextResponse.json(
				{ error: 'Test not found or already completed' },
				{ status: 404 }
			)
		}

		// Test sonuçlarının hesaplanması
		const results = calculateResults(assignedTest.test, answers)

		// Atanmış testin güncellenmesi
		const updatedAssignedTest =
			await prisma.assignedSkillPersonalityTest.update({
				where: { id: assignedTest.id },
				data: {
					completedAt: new Date(),
					answers,
					results
				}
			})

		console.log('Updated assigned test:', updatedAssignedTest)

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

// Test sonuçlarının hesaplanması için fonksiyon
function calculateResults(test, answers) {
	// Her bölüm için skorların hesaplanması
	const sectionScores = test.sections.map((section, sectionIndex) => {
		const sectionAnswers = Object.entries(answers)
			.filter(([key]) => key.startsWith(`${sectionIndex}-`))
			.map(([, value]) => parseInt(value))

		// Her sorunun maksimum puanını bildiğimizi varsayalım
		const maxScorePerQuestion = 5 // Bu değer, test yapısına göre değişebilir

		const totalScore = sectionAnswers.reduce(
			(sum, answer) => sum + answer,
			0
		)
		const maxPossibleScore =
			sectionAnswers.length * maxScorePerQuestion

		// 0-100 arasında bir skor hesapla
		const score = Math.round((totalScore / maxPossibleScore) * 100)

		return { title: section.title, score }
	})

	// Her alandaki skorların ayrıştırılması
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

	// Kişilik profili ve departman uyumluluğunun oluşturulması
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

// Kişilik profili oluşturma fonksiyonu
function generatePersonalityProfile(score) {
	if (score > 75) {
		return 'Dışa dönük, yenilikçi ve risk almaya açık bir kişilik profili.'
	} else if (score > 50) {
		return 'Dengeli, uyumlu ve esnek bir kişilik profili.'
	} else {
		return 'İçe dönük, analitik ve detaycı bir kişilik profili.'
	}
}

// Departman uyumluluğu oluşturma fonksiyonu
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
