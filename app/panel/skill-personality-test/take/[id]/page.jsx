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
	Send
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
		return <div>Loading...</div>
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
		<div className="container mx-auto p-6 flex flex-col md:flex-row md:gap-0 gap-6">
			<div className="md:w-1/4 mr-6 w-full">
				<Card>
					<CardHeader>
						<CardTitle>Test İlerlemesi</CardTitle>
					</CardHeader>
					<CardContent>
						{test.sections.map((section, index) => (
							<div
								key={index}
								className={`p-2 mb-2 rounded flex justify-between items-center ${
									index === currentSection
										? 'bg-primary text-primary-foreground'
										: 'bg-secondary'
								}`}
							>
								<span>
									{translateSectionTitle(section.title)} ({index + 1}/
									{test.sections.length})
								</span>
								{completedSections.includes(index) && (
									<CheckCircle2 className="h-5 w-5 text-green-500" />
								)}
							</div>
						))}
					</CardContent>
				</Card>
			</div>

			<div className="flex-1">
				<h1 className="text-3xl font-bold mb-8">
					{translateSectionTitle(currentSectionData.title)}
				</h1>
				<div className="flex items-center justify-between mb-4">
					<div>
						Soru {currentQuestion + 1} /{' '}
						{currentSectionData.questions.length}
					</div>
					<div>Kalan Süre: {formatTimeRemaining(timeRemaining)}</div>
				</div>
				<Progress value={progress} className="mb-4" />
				<Card>
					<CardContent className="pt-6">
						<p className="mb-4 text-lg">{question.text}</p>
						<RadioGroup
							value={
								answers[
									`${currentSection}-${currentQuestion}`
								]?.toString() || ''
							}
							onValueChange={(value) =>
								setAnswers((prev) => ({
									...prev,
									[`${currentSection}-${currentQuestion}`]: value
								}))
							}
							className="space-y-2"
						>
							{question.options.map((option, index) => (
								<div
									key={index}
									className="flex items-center space-x-2 p-2 rounded-md border border-input"
								>
									<RadioGroupItem
										value={index.toString()}
										id={`option-${index}`}
									/>
									<Label
										htmlFor={`option-${index}`}
										className="flex-grow cursor-pointer"
									>
										{option}
									</Label>
								</div>
							))}
						</RadioGroup>
					</CardContent>
					<CardFooter className="flex justify-between mt-4">
						<Button
							onClick={() => {
								if (currentQuestion > 0) {
									setCurrentQuestion((prev) => prev - 1)
								} else if (currentSection > 0) {
									setCurrentSection((prev) => prev - 1)
									setCurrentQuestion(
										test.sections[currentSection - 1].questions
											.length - 1
									)
								}
							}}
							disabled={currentSection === 0 && currentQuestion === 0}
							variant="outline"
						>
							<ChevronLeft className="mr-2 h-4 w-4" /> Önceki
						</Button>
						{currentSection < test.sections.length - 1 ||
						currentQuestion <
							currentSectionData.questions.length - 1 ? (
							<Button onClick={handleNextQuestion}>
								Sonraki <ChevronRight className="ml-2 h-4 w-4" />
							</Button>
						) : (
							<Button onClick={handleSubmit} disabled={isSubmitting}>
								{isSubmitting ? 'Gönderiliyor...' : 'Bitir'}{' '}
								<Send className="ml-2 h-4 w-4" />
							</Button>
						)}
					</CardFooter>
				</Card>
			</div>
		</div>
	)
}
