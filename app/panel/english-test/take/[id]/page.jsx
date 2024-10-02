'use client'

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
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
import { useToast } from '@/hooks/use-toast'

export default function TakeEnglishTestPage({ params }) {
	const [test, setTest] = useState(null)
	const [currentQuestion, setCurrentQuestion] = useState(0)
	const [answers, setAnswers] = useState({})
	const [timeRemaining, setTimeRemaining] = useState(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const router = useRouter()
	const { toast } = useToast()

	const fetchTest = useCallback(async () => {
		console.log('Fetching test with AssignedTest ID:', params.id)
		try {
			const response = await fetch(
				`/api/english-test/assigned/${params.id}`
			)
			console.log('API Response:', response)
			if (!response.ok) {
				const errorData = await response.json()
				console.error('API Error:', errorData)
				throw new Error(errorData.error || 'Failed to fetch test')
			}
			const data = await response.json()
			console.log('Test data received:', data)
			setTest(data.test)
			setTimeRemaining(data.timeRemaining)
		} catch (error) {
			console.error('Error fetching test:', error)
			toast({
				variant: 'destructive',
				title: 'Error',
				description:
					error.message ||
					'An unexpected error occurred. Please try again.'
			})
			router.push('/panel/english-test')
		} finally {
			setIsLoading(false)
		}
	}, [params.id, router, toast])

	useEffect(() => {
		fetchTest()
	}, [fetchTest])

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
	}, [timeRemaining])

	useEffect(() => {
		const handleBeforeUnload = (e) => {
			e.preventDefault()
			e.returnValue = ''
		}
		window.addEventListener('beforeunload', handleBeforeUnload)
		return () =>
			window.removeEventListener('beforeunload', handleBeforeUnload)
	}, [])

	const handleAnswer = (answer) => {
		setAnswers((prevAnswers) => ({
			...prevAnswers,
			[currentQuestion]: answer
		}))
	}

	const handleNext = () => {
		if (currentQuestion < test.questions.length - 1) {
			setCurrentQuestion((prev) => prev + 1)
		}
	}

	const handlePrevious = () => {
		if (currentQuestion > 0) {
			setCurrentQuestion((prev) => prev - 1)
		}
	}

	const handleSubmit = async () => {
		setIsSubmitting(true)
		try {
			const response = await fetch('/api/english-test/submit', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ testId: params.id, answers })
			})
			if (response.ok) {
				toast({
					title: 'Success',
					description: 'Test submitted successfully'
				})
				router.push('/panel/english-test/results')
			} else {
				throw new Error('Failed to submit test')
			}
		} catch (error) {
			console.error('Error submitting test:', error)
			toast({
				variant: 'destructive',
				title: 'Error',
				description: 'Failed to submit test. Please try again.'
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	if (isLoading) return <div>Loading...</div>
	if (!test) return null

	const question = test.questions[currentQuestion]

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-3xl font-bold mb-8">{test.title}</h1>
			<div className="mb-4">
				Time Remaining: {Math.floor(timeRemaining / 60)}:
				{(timeRemaining % 60).toString().padStart(2, '0')}
			</div>
			<Card>
				<CardHeader>
					<CardTitle>
						Question {currentQuestion + 1} of {test.questions.length}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="mb-4">{question.question}</p>
					<RadioGroup
						value={answers[currentQuestion]?.toString()}
						onValueChange={handleAnswer}
					>
						{question.options.map((option, index) => (
							<div
								key={index}
								className="flex items-center space-x-2"
							>
								<RadioGroupItem
									value={index.toString()}
									id={`option-${index}`}
								/>
								<Label htmlFor={`option-${index}`}>{option}</Label>
							</div>
						))}
					</RadioGroup>
				</CardContent>
				<CardFooter className="flex justify-between">
					<Button
						onClick={handlePrevious}
						disabled={currentQuestion === 0}
					>
						Previous
					</Button>
					{currentQuestion < test.questions.length - 1 ? (
						<Button onClick={handleNext}>Next</Button>
					) : (
						<Button onClick={handleSubmit} disabled={isSubmitting}>
							{isSubmitting ? 'Submitting...' : 'Submit Test'}
						</Button>
					)}
				</CardFooter>
			</Card>
		</div>
	)
}
