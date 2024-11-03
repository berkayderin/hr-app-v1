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

		let assignedTest =
			await prisma.assignedSkillPersonalityTest.findFirst({
				where: {
					OR: [{ id: testId }, { testId: testId }],
					userId: session.user.id
				},
				include: { test: true }
			})

		if (!assignedTest) {
			const allAssignedTests =
				await prisma.assignedSkillPersonalityTest.findMany({
					where: { userId: session.user.id },
					select: { id: true, testId: true }
				})

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
		// Her bölümdeki soruların cevaplarını kontrol et
		const sectionAnswers = Object.entries(answers)
			.filter(([key]) => key.startsWith(`${sectionIndex}-`))
			.map(([key]) => {
				const questionIndex = parseInt(key.split('-')[1])
				const givenAnswer = parseInt(answers[key])
				const correctAnswer =
					section.questions[questionIndex].correctAnswer

				// Cevap doğruysa 20 puan, yanlışsa 0 puan
				return givenAnswer === correctAnswer ? 20 : 0
			})

		// Bölüm toplam puanı
		const totalScore = sectionAnswers.reduce(
			(sum, score) => sum + score,
			0
		)
		const maxPossibleScore = section.questions.length * 20
		const score = Math.round((totalScore / maxPossibleScore) * 100)

		console.log(`Section ${section.title}:`, {
			answers: sectionAnswers,
			totalScore,
			maxPossibleScore,
			finalScore: score
		})

		return { title: section.title, score }
	})

	// Bölüm skorlarının ayrıştırılması
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

	console.log('Overall Scores:', {
		iqScore,
		practicalScore,
		sharpScore,
		personalityScore
	})

	return {
		sectionScores,
		overallResults: {
			iqScore,
			practicalScore,
			sharpScore,
			personalityScore
		},
		personalityProfile: generatePersonalityProfile(personalityScore),
		departmentCompatibility: generateDepartmentCompatibility(
			iqScore,
			practicalScore,
			sharpScore,
			personalityScore
		)
	}
}

// Kişilik profili oluşturma fonksiyonu
function generatePersonalityProfile(score) {
	return {
		profileLevel: determineProfileLevel(score),
		traits: determinePersonalityTraits(score),
		strengths: determineStrengths(score),
		improvements: determineImprovements(score)
	}
}

function determineProfileLevel(score) {
	if (score > 90) return 'Yüksek Performans Potansiyeli'
	if (score > 80) return 'Gelişmiş Yetkinlik'
	if (score > 70) return 'Yeterli Performans'
	if (score > 60) return 'Gelişime Açık'
	return 'Temel Seviye'
}

function determinePersonalityTraits(score) {
	if (score > 90) {
		return {
			leadership: 'Güçlü',
			innovation: 'Yüksek',
			teamwork: 'Etkili',
			communication: 'Mükemmel'
		}
	} else if (score > 80) {
		return {
			leadership: 'İyi',
			innovation: 'Gelişmiş',
			teamwork: 'Güçlü',
			communication: 'İyi'
		}
	} else if (score > 70) {
		return {
			leadership: 'Orta',
			innovation: 'İyi',
			teamwork: 'Yeterli',
			communication: 'Gelişebilir'
		}
	} else if (score > 60) {
		return {
			leadership: 'Gelişebilir',
			innovation: 'Orta',
			teamwork: 'Gelişebilir',
			communication: 'Temel'
		}
	} else {
		return {
			leadership: 'Temel',
			innovation: 'Gelişebilir',
			teamwork: 'Temel',
			communication: 'Gelişebilir'
		}
	}
}

function determineStrengths(score) {
	const allStrengths = {
		90: [
			'Liderlik',
			'Stratejik Düşünme',
			'Yenilikçilik',
			'İkna Kabiliyeti'
		],
		80: [
			'Takım Çalışması',
			'Problem Çözme',
			'İletişim',
			'Adaptasyon'
		],
		70: [
			'Analitik Düşünme',
			'Planlama',
			'Organizasyon',
			'Detay Odaklılık'
		],
		60: ['Bireysel Çalışma', 'Takip', 'Uygulama', 'Düzen'],
		0: ['Temel Analiz', 'Rutin İşler', 'Yapılandırılmış Görevler']
	}

	for (const threshold in allStrengths) {
		if (score > parseInt(threshold)) {
			return allStrengths[threshold]
		}
	}
	return allStrengths[0]
}

function determineImprovements(score) {
	const allImprovements = {
		90: ['Detay Odaklılık', 'Sabır', 'Rutin İş Toleransı'],
		80: ['Analitik Düşünme', 'Bireysel Çalışma', 'Risk Yönetimi'],
		70: ['İnisiyatif Alma', 'Yaratıcılık', 'Liderlik'],
		60: ['İletişim', 'Takım Çalışması', 'Esneklik'],
		0: ['Temel Beceriler', 'İş Süreçleri', 'Profesyonel Gelişim']
	}

	for (const threshold in allImprovements) {
		if (score > parseInt(threshold)) {
			return allImprovements[threshold]
		}
	}
	return allImprovements[0]
}

// Departman uyumluluğu oluşturma fonksiyonu
function generateDepartmentCompatibility(
	iqScore,
	practicalScore,
	sharpScore,
	personalityScore
) {
	const departments = [
		{
			name: 'Yazılım Geliştirme',
			weights: {
				iq: 0.35,
				practical: 0.2,
				sharp: 0.35,
				personality: 0.1
			},
			threshold: 50
		},
		{
			name: 'İş Analizi',
			weights: {
				iq: 0.3,
				practical: 0.3,
				sharp: 0.3,
				personality: 0.1
			},
			threshold: 50
		},
		{
			name: 'Proje Yönetimi',
			weights: {
				iq: 0.25,
				practical: 0.3,
				sharp: 0.2,
				personality: 0.25
			},
			threshold: 50
		},
		{
			name: 'Ürün Yönetimi',
			weights: {
				iq: 0.25,
				practical: 0.25,
				sharp: 0.25,
				personality: 0.25
			},
			threshold: 50
		}
	]

	const results = departments.map((dept) => {
		const score = calculateDepartmentScore(
			dept.weights,
			iqScore,
			practicalScore,
			sharpScore,
			personalityScore
		)

		return {
			department: dept.name,
			score: Math.round(score),
			suitable: score >= dept.threshold,
			details: generateDepartmentDetails(dept.name, score)
		}
	})

	return {
		recommendations: results
			.filter((r) => r.suitable)
			.sort((a, b) => b.score - a.score),
		allScores: results.sort((a, b) => b.score - a.score)
	}
}

function calculateDepartmentScore(
	weights,
	iq,
	practical,
	sharp,
	personality
) {
	return (
		weights.iq * iq +
		weights.practical * practical +
		weights.sharp * sharp +
		weights.personality * personality
	)
}

function generateDepartmentDetails(department, score) {
	const details = {
		'Yazılım Geliştirme': {
			requirements: [
				'Analitik düşünme',
				'Problem çözme',
				'Teknik beceriler'
			],
			benefits: [
				'Sürekli öğrenme',
				'Yenilikçi projeler',
				'Teknik gelişim'
			],
			challenges: [
				'Hızlı değişen teknolojiler',
				'Karmaşık problemler'
			]
		},
		'İş Analizi': {
			requirements: ['Analiz yeteneği', 'İletişim', 'Dokümantasyon'],
			benefits: ['Süreç iyileştirme', 'Çözüm tasarımı', 'İş bilgisi'],
			challenges: ['Paydaş yönetimi', 'Değişen gereksinimler']
		},
		'Proje Yönetimi': {
			requirements: ['Organizasyon', 'İletişim', 'Risk yönetimi'],
			benefits: [
				'Liderlik fırsatı',
				'Çeşitli projeler',
				'Strateji geliştirme'
			],
			challenges: ['Kaynak yönetimi', 'Zaman baskısı']
		},
		'Ürün Yönetimi': {
			requirements: [
				'Vizyon oluşturma',
				'Stratejik düşünme',
				'Paydaş yönetimi'
			],
			benefits: ['Ürün stratejisi', 'Pazar etkisi', 'İnovasyon'],
			challenges: ['Pazar belirsizliği', 'Rekabet']
		}
	}

	return {
		...details[department],
		potentialScore: score,
		recommendation:
			score >= 80
				? 'Yüksek uyumluluk'
				: score >= 70
				? 'Orta uyumluluk'
				: 'Düşük uyumluluk'
	}
}
