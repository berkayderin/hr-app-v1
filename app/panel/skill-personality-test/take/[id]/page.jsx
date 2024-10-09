// app/panel/skill-personality-test/take/[id]/page.jsx
'use client'

import { useState, useEffect } from 'react'
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
import { ChevronLeft, ChevronRight, Send } from 'lucide-react'
import { toast } from 'sonner'

export default function TakeSkillPersonalityTestPage() {
	const params = useParams()
	const [test, setTest] = useState(null)
	const [currentSection, setCurrentSection] = useState(0)
	const [currentQuestion, setCurrentQuestion] = useState(0)
	const [answers, setAnswers] = useState({})
	const [timeRemaining, setTimeRemaining] = useState(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [assignedTestId, setAssignedTestId] = useState(null)
	const router = useRouter()

	useEffect(() => {
		const fetchTest = async () => {
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
		}
		fetchTest()
	}, [params.id, router])

	useEffect(() => {
		if (timeRemaining === null) return
		const timer = setInterval(() => {
			setTimeRemaining((prevTime) => {
				if (prevTime <= 1) {
					clearInterval(timer)
					handleSubmit()
					return 0
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
			if (!assignedTestId) {
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
			router.push('/panel/skill-personality-test/results')
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
		<div className="container mx-auto p-6 max-w-2xl">
			<h1 className="text-3xl font-bold mb-8 text-center">
				{test.title}
			</h1>
			<div className="flex items-center justify-between mb-4">
				<div>Section: {currentSectionData.title}</div>
				<div>
					Time Remaining: {Math.floor(timeRemaining / 60)}:
					{(timeRemaining % 60).toString().padStart(2, '0')}
				</div>
			</div>
			<Progress value={progress} className="mb-4" />
			<Card>
				<CardHeader>
					<CardTitle>
						Question {currentQuestion + 1} /{' '}
						{currentSectionData.questions.length}
					</CardTitle>
				</CardHeader>
				<CardContent>
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
								className="flex items-center space-x-2 p-2 rounded-md hover:bg-secondary"
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
				<CardFooter className="flex justify-between">
					<Button
						onClick={() => {
							if (currentQuestion > 0) {
								setCurrentQuestion((prev) => prev - 1)
							} else if (currentSection > 0) {
								setCurrentSection((prev) => prev - 1)
								setCurrentQuestion(
									test.sections[currentSection - 1].questions.length -
										1
								)
							}
						}}
						disabled={currentSection === 0 && currentQuestion === 0}
						variant="outline"
					>
						<ChevronLeft className="mr-2 h-4 w-4" /> Previous
					</Button>
					{currentSection < test.sections.length - 1 ||
					currentQuestion <
						currentSectionData.questions.length - 1 ? (
						<Button
							onClick={() => {
								if (
									currentQuestion <
									currentSectionData.questions.length - 1
								) {
									setCurrentQuestion((prev) => prev + 1)
								} else if (
									currentSection <
									test.sections.length - 1
								) {
									setCurrentSection((prev) => prev + 1)
									setCurrentQuestion(0)
								}
							}}
						>
							Next <ChevronRight className="ml-2 h-4 w-4" />
						</Button>
					) : (
						<Button onClick={handleSubmit} disabled={isSubmitting}>
							{isSubmitting ? 'Submitting...' : 'Submit'}{' '}
							<Send className="ml-2 h-4 w-4" />
						</Button>
					)}
				</CardFooter>
			</Card>
		</div>
	)
}
