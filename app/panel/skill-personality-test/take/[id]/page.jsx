// app/panel/skill-personality-test/take/[id]/page.jsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
	RadioGroup,
	RadioGroupItem
} from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	Send,
	Timer
} from 'lucide-react'
import { toast } from 'sonner'

const formatTimeRemaining = (seconds) => {
	const minutes = Math.floor(seconds / 60)
	const remainingSeconds = seconds % 60
	return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export default function TakeSkillPersonalityTestPage() {
	const params = useParams()
	const [test, setTest] = useState(null)
	const [currentSection, setCurrentSection] = useState(0)
	const [currentQuestion, setCurrentQuestion] = useState(0)
	const [answers, setAnswers] = useState({})
	const [timeRemaining, setTimeRemaining] = useState(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [assignedTestId, setAssignedTestId] = useState(null)
	const [completedSections, setCompletedSections] = useState([])
	const router = useRouter()

	const fetchTest = useCallback(async () => {
		try {
			console.log('Fetching test with params.id:', params.id)
			const response = await fetch(
				`/api/skill-personality-test/assigned/${params.id}`
			)
			if (!response.ok) throw new Error('Failed to fetch test')
			const data = await response.json()
			console.log('Fetched test data:', data)
			setTest(data.test)
			setTimeRemaining(data.timeRemaining)
			setAssignedTestId(data.id)
			console.log('Set assignedTestId:', data.id)
		} catch (error) {
			console.error('Error fetching test:', error)
			toast.error('Failed to load test')
			router.push('/panel')
		}
	}, [params.id, router])

	useEffect(() => {
		fetchTest()
	}, [fetchTest])

	useEffect(() => {
		console.log('Current assignedTestId:', assignedTestId)
	}, [assignedTestId])

	useEffect(() => {
		if (timeRemaining === null) return
		const timer = setInterval(() => {
			setTimeRemaining((prevTime) => {
				if (prevTime <= 1) {
					clearInterval(timer)
					handleSubmit()
					return 0
				}
				// 5 dakika kala uyarı
				if (prevTime === 300) {
					toast.warning('Testin bitmesine 5 dakika kaldı!')
				}
				// 1 dakika kala uyarı
				if (prevTime === 60) {
					toast.warning('Testin bitmesine 1 dakika kaldı!')
				}
				return prevTime - 1
			})
		}, 1000)
		return () => clearInterval(timer)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [timeRemaining])

	const handleSubmit = async () => {
		setIsSubmitting(true)
		try {
			console.log(
				'handleSubmit called. Current assignedTestId:',
				assignedTestId
			)
			if (!assignedTestId) {
				console.error('Test ID is not available:', assignedTestId)
				throw new Error('Test ID is not available')
			}
			const payload = { testId: assignedTestId, answers }
			console.log('Sending payload:', payload)

			const response = await fetch(
				'/api/skill-personality-test/submit',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload)
				}
			)

			const result = await response.json()
			console.log('Received response:', result)

			if (!response.ok) {
				throw new Error(
					result.error || `HTTP error! status: ${response.status}`
				)
			}

			toast.success('Test başarıyla gönderildi')
			router.push('/panel/')
		} catch (error) {
			console.error('Test gönderme hatası:', error)
			toast.error(
				error.message || 'Test gönderilirken bir hata oluştu'
			)
		} finally {
			setIsSubmitting(false)
		}
	}

	if (!test || assignedTestId === null) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
			</div>
		)
	}

	const markSectionAsCompleted = (sectionIndex) => {
		if (!completedSections.includes(sectionIndex)) {
			setCompletedSections((prev) => [...prev, sectionIndex])
		}
	}

	const handleNextQuestion = () => {
		const currentSectionData = test.sections[currentSection]

		if (currentQuestion < currentSectionData.questions.length - 1) {
			// Aynı bölüm içinde bir sonraki soruya geç
			setCurrentQuestion((prev) => prev + 1)
		} else {
			// Bölümün son sorusundayız, bölümü tamamlanmış olarak işaretle
			markSectionAsCompleted(currentSection)

			if (currentSection < test.sections.length - 1) {
				// Bir sonraki bölüme geç
				setCurrentSection((prev) => prev + 1)
				setCurrentQuestion(0)
			}
		}
	}

	const translateSectionTitle = (title) => {
		const translations = {
			'IQ Test': 'IQ Testi',
			'Practical Intelligence': 'Pratik Zeka',
			'Sharp Intelligence': 'Keskin Zeka',
			'Personality Analysis': 'Kişilik Analizi'
		}
		return translations[title] || title
	}

	const currentSectionData = test.sections[currentSection]
	const question = currentSectionData.questions[currentQuestion]
	const progress =
		((currentSection * currentSectionData.questions.length +
			currentQuestion +
			1) /
			test.sections.reduce(
				(acc, section) => acc + section.questions.length,
				0
			)) *
		100

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="bg-white border-b sticky top-0 z-10 shadow-sm">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<h1 className="text-xl font-semibold text-gray-800">
							{translateSectionTitle(currentSectionData.title)}
						</h1>
						<div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full">
							<Timer className="h-4 w-4" />
							<span className="font-medium">
								{formatTimeRemaining(timeRemaining)}
							</span>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 py-8">
				<div className="flex gap-8">
					<div className="w-72 hidden lg:block">
						<div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
							<h2 className="text-lg font-semibold mb-4">
								Test Bölümleri
							</h2>
							<div className="space-y-2">
								{test.sections.map((section, index) => (
									<div
										key={index}
										className={`p-3 rounded-lg transition-colors ${
											index === currentSection
												? 'bg-primary text-white'
												: completedSections.includes(index)
												? 'bg-green-50 text-green-700 border border-green-200'
												: 'bg-gray-50 text-gray-700'
										}`}
									>
										<div className="flex items-center justify-between">
											<span className="font-medium">
												{translateSectionTitle(section.title)}
											</span>
											{completedSections.includes(index) && (
												<CheckCircle2 className="h-4 w-4" />
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					<div className="flex-1 max-w-3xl">
						<div className="mb-8">
							<div className="flex justify-between items-center mb-2 text-sm text-gray-600">
								<span>Bölüm İlerlemesi</span>
								<span>
									{currentQuestion + 1} /{' '}
									{currentSectionData.questions.length}
								</span>
							</div>
							<Progress value={progress} className="h-2" />
						</div>

						<Card className="border-none shadow-lg">
							<CardContent className="p-8">
								<div className="space-y-8">
									<div>
										<span className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium mb-4">
											Soru {currentQuestion + 1}
										</span>
										<h2 className="text-xl font-medium text-gray-900">
											{question.text}
										</h2>
									</div>

									<RadioGroup
										value={
											answers[
												`${currentSection}-${currentQuestion}`
											]?.toString() || ''
										}
										onValueChange={(value) =>
											setAnswers((prev) => ({
												...prev,
												[`${currentSection}-${currentQuestion}`]:
													value
											}))
										}
										className="space-y-4"
									>
										{question.options.map((option, index) => (
											<div key={index} className="relative">
												<Label
													htmlFor={`option-${index}`}
													className={`flex p-4 cursor-pointer transition-all rounded-lg border ${
														answers[
															`${currentSection}-${currentQuestion}`
														]?.toString() === index.toString()
															? 'bg-primary/5 border-primary text-primary'
															: 'bg-white hover:bg-gray-50 border-gray-200'
													}`}
												>
													<RadioGroupItem
														value={index.toString()}
														id={`option-${index}`}
														className="mr-3"
													/>
													<span className="text-sm font-medium leading-none">
														{option}
													</span>
												</Label>
											</div>
										))}
									</RadioGroup>

									<div className="flex justify-between pt-6">
										<Button
											onClick={() => {
												if (currentQuestion > 0) {
													setCurrentQuestion((prev) => prev - 1)
												} else if (currentSection > 0) {
													setCurrentSection((prev) => prev - 1)
													setCurrentQuestion(
														test.sections[currentSection - 1]
															.questions.length - 1
													)
												}
											}}
											disabled={
												currentSection === 0 && currentQuestion === 0
											}
											variant="outline"
											className="w-32"
										>
											<ChevronLeft className="mr-2 h-4 w-4" /> Önceki
										</Button>

										{currentSection < test.sections.length - 1 ||
										currentQuestion <
											currentSectionData.questions.length - 1 ? (
											<Button
												onClick={handleNextQuestion}
												className="w-32"
											>
												Sonraki{' '}
												<ChevronRight className="ml-2 h-4 w-4" />
											</Button>
										) : (
											<Button
												onClick={handleSubmit}
												disabled={isSubmitting}
												className="w-32 bg-green-600 hover:bg-green-700"
											>
												{isSubmitting ? (
													<div className="flex items-center">
														<span className="animate-spin mr-2">
															◌
														</span>
														Gönderiliyor
													</div>
												) : (
													<>
														Bitir <Send className="ml-2 h-4 w-4" />
													</>
												)}
											</Button>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	)
}
