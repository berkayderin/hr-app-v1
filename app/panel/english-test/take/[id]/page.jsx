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
import { toast } from 'sonner'

export default function TakeEnglishTestPage() {
	const params = useParams()
	const [test, setTest] = useState(null)
	const [currentQuestion, setCurrentQuestion] = useState(0)
	const [answers, setAnswers] = useState({})
	const [timeRemaining, setTimeRemaining] = useState(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [isTestCompleted, setIsTestCompleted] = useState(false)

	const router = useRouter()

	const fetchTest = useCallback(async () => {
		try {
			const response = await fetch(
				`/api/english-test/assigned/${params.id}`
			)
			if (!response.ok) {
				throw new Error('Testi getirme başarısız oldu')
			}
			const data = await response.json()
			setTest(data.test)
			setTimeRemaining(data.timeRemaining)
			if (data.test.completedAt) {
				setIsTestCompleted(true)
				toast.info('Bu test zaten tamamlanmış')
				setTimeout(() => router.push('/panel/'), 3000) // 3 saniye sonra yönlendir
			}
		} catch (error) {
			console.error('Test yükleme hatası:', error)
			toast.error('Test yüklenirken bir hata oluştu')
			router.push('/panel/')
		} finally {
			setIsLoading(false)
		}
	}, [params.id, router])

	useEffect(() => {
		fetchTest()
	}, [fetchTest])

	useEffect(() => {
		if (test && test.completedAt) {
			setIsTestCompleted(true)
		}
	}, [test])

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
		if (isTestCompleted) {
			toast.info('Bu test zaten tamamlanmış')
			router.push('/panel/')
			return
		}

		setIsSubmitting(true)
		try {
			const response = await fetch('/api/english-test/submit', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ testId: params.id, answers })
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.error || 'Bir hata oluştu')
			}

			toast.success('Test başarıyla gönderildi')
			setIsTestCompleted(true)
			setTimeout(() => router.push('/panel/'), 3000) // 3 saniye sonra yönlendir
		} catch (error) {
			console.error('Test gönderme hatası:', error)
			if (error.message === 'Test already completed') {
				toast.info('Bu test daha önce tamamlanmış')
				setIsTestCompleted(true)
				setTimeout(() => router.push('/panel/'), 3000) // 3 saniye sonra yönlendir
			} else {
				toast.error(`Gönderme Hatası: ${error.message}`)
			}
		} finally {
			setIsSubmitting(false)
		}
	}

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				Yükleniyor...
			</div>
		)
	}

	if (isTestCompleted) {
		return (
			<div className="flex flex-col items-center justify-center h-screen">
				<h1 className="text-2xl font-bold mb-4">Test Tamamlandı</h1>
				<p>Anasayfaya yönlendiriliyorsunuz...</p>
			</div>
		)
	}

	const question = test.questions[currentQuestion]
	const progress =
		((currentQuestion + 1) / test.questions.length) * 100

	return (
		<div className="container mx-auto p-6 max-w-2xl">
			<h1 className="text-3xl font-bold mb-8 text-center">
				İngilizce Testim: {test.title}
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
						<Button
							onClick={handleSubmit}
							disabled={isSubmitting || isTestCompleted}
							className="mt-4"
						>
							{isSubmitting
								? 'Gönderiliyor...'
								: 'Testi Bitir ve Gönder'}
						</Button>
					)}
				</CardFooter>
			</Card>
		</div>
	)
}
