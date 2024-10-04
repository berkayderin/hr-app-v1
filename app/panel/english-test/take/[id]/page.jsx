// app/panel/english-test/take/[id]/page.jsx
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
	AlertCircle,
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	Send
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function TakeEnglishTestPage() {
	const params = useParams()
	const [test, setTest] = useState(null)
	const [currentQuestion, setCurrentQuestion] = useState(0)
	const [answers, setAnswers] = useState({})
	const [timeRemaining, setTimeRemaining] = useState(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const router = useRouter()
	const { toast } = useToast()

	const fetchTest = useCallback(async () => {
		try {
			const response = await fetch(
				`/api/english-test/assigned/${params.id}`
			)
			if (!response.ok) {
				throw new Error('Testi getirme başarısız oldu')
			}
			const data = await response.json()
			if (data.test.completed) {
				toast({
					variant: 'destructive',
					title: 'Test Zaten Tamamlandı',
					description: 'Bu test daha önce gönderilmiş.'
				})
				router.push('/panel/english-test')
				return
			}
			setTest(data.test)
			setTimeRemaining(data.timeRemaining)
		} catch (error) {
			toast({
				variant: 'destructive',
				title: 'Hata',
				description:
					error.message ||
					'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.'
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
					title: 'Test Gönderildi',
					description: 'Testiniz başarıyla gönderildi.',
					icon: <CheckCircle2 className="h-4 w-4" />
				})
				router.push('/panel/english-test/results')
			} else {
				throw new Error('Testi gönderme başarısız oldu')
			}
		} catch (error) {
			toast({
				variant: 'destructive',
				title: 'Gönderme Hatası',
				description: `Testi gönderme başarısız oldu: ${error.message}`,
				icon: <AlertCircle className="h-4 w-4" />
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	if (isLoading)
		return (
			<div className="flex justify-center items-center h-screen">
				Yükleniyor...
			</div>
		)
	if (!test) return null

	const question = test.questions[currentQuestion]
	const progress =
		((currentQuestion + 1) / test.questions.length) * 100

	return (
		<div className="container mx-auto p-6 max-w-2xl">
			<h1 className="text-3xl font-bold mb-8 text-center">
				İngilizce Tesim: {test.title}
			</h1>
			<div className="flex items-center justify-start gap-1 mb-4 border rounded-md p-2">
				<AlertCircle className="h-5 w-5" />
				<div className="font-medium">Kalan Süre:</div>
				<div>
					{Math.floor(timeRemaining / 60)}:
					{(timeRemaining % 60).toString().padStart(2, '0')}
				</div>
			</div>
			<Progress value={progress} className="mb-4" />
			<Card>
				<CardHeader>
					<CardTitle>
						Soru {currentQuestion + 1} / {test.questions.length}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="mb-4 text-lg">{question.question}</p>
					<RadioGroup
						value={answers[currentQuestion]?.toString() || ''}
						onValueChange={handleAnswer}
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
						onClick={handlePrevious}
						disabled={currentQuestion === 0}
						variant="outline"
					>
						<ChevronLeft className="mr-2 h-4 w-4" /> Önceki
					</Button>
					{currentQuestion < test.questions.length - 1 ? (
						<Button onClick={handleNext}>
							Sonraki <ChevronRight className="ml-2 h-4 w-4" />
						</Button>
					) : (
						<Button onClick={handleSubmit} disabled={isSubmitting}>
							{isSubmitting ? 'Gönderiliyor...' : 'Gönder'}{' '}
							<Send className="ml-2 h-4 w-4" />
						</Button>
					)}
				</CardFooter>
			</Card>
		</div>
	)
}
