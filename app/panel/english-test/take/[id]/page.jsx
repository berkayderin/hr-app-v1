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
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
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

	const question = test?.questions[currentQuestion]
	const progress =
		((currentQuestion + 1) / test?.questions.length) * 100

	if (isLoading)
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
			</div>
		)

	if (isTestCompleted) {
		return (
			<div className="flex flex-col items-center justify-center h-screen">
				<h1 className="text-2xl font-bold mb-4">Test Tamamlandı</h1>
				<p>Anasayfaya yönlendiriliyorsunuz...</p>
			</div>
		)
	}
	return (
		<div className="min-h-screen bg-gray-50">
			<div className="bg-white border-b sticky top-0 z-10 shadow-sm">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<h1 className="text-xl font-semibold text-gray-800">
							{test.title}
						</h1>
						<div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full">
							<AlertCircle className="h-4 w-4" />
							<span className="font-medium">
								{Math.floor(timeRemaining / 60)}:
								{(timeRemaining % 60).toString().padStart(2, '0')}
							</span>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 py-8">
				<div className="max-w-3xl mx-auto">
					<div className="mb-8">
						<div className="flex justify-between items-center mb-2 text-sm text-gray-600">
							<span>İlerleme</span>
							<span>
								{currentQuestion + 1} / {test.questions.length}
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
										{question.question}
									</h2>
								</div>

								<RadioGroup
									value={answers[currentQuestion]?.toString() || ''}
									onValueChange={handleAnswer}
									className="space-y-4"
								>
									{question.options.map((option, index) => (
										<div key={index} className="relative">
											<Label
												htmlFor={`option-${index}`}
												className={`flex p-4 cursor-pointer transition-all rounded-lg border ${
													answers[currentQuestion]?.toString() ===
													index.toString()
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
										onClick={handlePrevious}
										disabled={currentQuestion === 0}
										variant="outline"
										className="w-32"
									>
										<ChevronLeft className="mr-2 h-4 w-4" /> Önceki
									</Button>

									{currentQuestion < test.questions.length - 1 ? (
										<Button onClick={handleNext} className="w-32">
											Sonraki{' '}
											<ChevronRight className="ml-2 h-4 w-4" />
										</Button>
									) : (
										<Button
											onClick={handleSubmit}
											disabled={isSubmitting || isTestCompleted}
											className="w-32 bg-green-600 hover:bg-green-700"
										>
											{isSubmitting ? (
												<div className="flex items-center">
													<span className="animate-spin mr-2">◌</span>
													Gönderiliyor
												</div>
											) : (
												'Testi Bitir'
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
	)
}
