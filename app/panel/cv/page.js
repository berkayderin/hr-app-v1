'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
	Loader2,
	Send,
	Code2,
	Languages,
	Award,
	FolderGit2,
	FileText,
	Code2Icon,
	GraduationCapIcon
} from 'lucide-react'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
	Alert,
	AlertDescription,
	AlertTitle
} from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger
} from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Turkish field labels mapping
const fieldLabels = {
	fullName: 'Ad Soyad',
	email: 'E-posta',
	phone: 'Telefon',
	address: 'Adres',
	education: 'Eğitim',
	workExperience: 'İş Deneyimi',
	skills: 'Yetenekler',
	languages: 'Yabancı Diller',
	certifications: 'Sertifikalar',
	projects: 'Projeler',
	summary: 'Özet'
}

// Turkish placeholders mapping
const fieldPlaceholders = {
	fullName: 'Ad ve soyadınızı giriniz',
	email: 'E-posta adresinizi giriniz',
	phone: 'Telefon numaranızı giriniz',
	address: 'Adresinizi giriniz',
	education: 'Eğitim bilgilerinizi detaylı olarak giriniz...',
	workExperience: 'İş deneyimlerinizi detaylı olarak giriniz...',
	skills: 'Yeteneklerinizi giriniz...',
	languages: 'Bildiğiniz yabancı dilleri giriniz',
	certifications: 'Sertifikalarınızı giriniz...',
	projects: 'Projelerinizi detaylı olarak giriniz...',
	summary: 'Kendinizi kısaca tanıtınız...'
}

const formSchema = z.object({
	fullName: z.string().min(2, 'Ad Soyad en az 2 karakter olmalıdır'),
	email: z.string().email('Geçerli bir e-posta adresi giriniz'),
	phone: z.string().min(10, 'Geçerli bir telefon numarası giriniz'),
	address: z.string().min(5, 'Geçerli bir adres giriniz'),
	education: z
		.string()
		.min(10, 'Eğitim bilgilerinizi detaylı giriniz'),
	workExperience: z
		.string()
		.min(10, 'İş deneyimlerinizi detaylı giriniz'),
	skills: z.string(),
	languages: z.string(),
	certifications: z.string(),
	projects: z.string(),
	summary: z.string().min(50, 'Özet en az 50 karakter olmalıdır')
})

const CVPage = () => {
	const [loading, setLoading] = useState(false)
	const [progress, setProgress] = useState(0)
	const [currentTab, setCurrentTab] = useState('personal')
	const [aiEvaluation, setAiEvaluation] = useState({
		generalFeedback: '',
		sections: [],
		improvements: [],
		strengths: [],
		weaknesses: [],
		industryTrends: []
	})

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			fullName: '',
			email: '',
			phone: '',
			address: '',
			education: '',
			workExperience: '',
			skills: '',
			languages: '',
			certifications: '',
			projects: '',
			summary: ''
		}
	})

	const calculateProgress = React.useCallback((values) => {
		if (!values) return 0

		const fields = Object.keys(values)
		const filledFields = fields.filter(
			(field) =>
				values[field] &&
				typeof values[field] === 'string' &&
				values[field].trim().length > 0
		)
		return (filledFields.length / fields.length) * 100
	}, [])

	useEffect(() => {
		const subscription = form.watch((values) => {
			setProgress(calculateProgress(values))
		})
		return () => subscription.unsubscribe()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [form.watch, calculateProgress])

	const onSubmit = async (data) => {
		setLoading(true)
		try {
			const response = await fetch('/api/cv/evaluate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			})

			if (!response.ok) throw new Error('API response failed')

			const result = await response.json()
			setAiEvaluation(result)
			setCurrentTab('evaluation')
		} catch (error) {
			console.error('CV evaluation error:', error)
			setAiEvaluation({
				generalFeedback:
					'Değerlendirme sırasında bir hata oluştu. Lütfen tekrar deneyin.',
				sections: [],
				improvements: [],
				strengths: [],
				weaknesses: [],
				industryTrends: []
			})
		} finally {
			setLoading(false)
		}
	}

	const formSections = {
		personal: {
			title: 'Kişisel Bilgiler',
			icon: FileText,
			fields: ['fullName', 'email', 'phone', 'address']
		},
		education: {
			title: 'Eğitim ve Deneyim',
			icon: GraduationCapIcon,
			fields: ['education', 'workExperience']
		},
		skills: {
			title: 'Yetenekler ve Diller',
			icon: Code2Icon,
			fields: ['skills', 'languages']
		},
		additional: {
			title: 'Ek Bilgiler',
			icon: FolderGit2,
			fields: ['certifications', 'projects', 'summary']
		}
	}

	return (
		<div className="container mx-auto py-8 px-4">
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">
					CV Değerlendirme Sistemi
				</h1>
				<p className="text-gray-600">
					Yapay zeka destekli CV değerlendirme ve öneriler
				</p>
				<Progress value={progress} className="mt-4" />
				<p className="text-sm text-gray-500 mt-1">
					Tamamlama: {Math.round(progress)}%
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<Card className="p-6">
					<CardHeader>
						<CardTitle>CV Oluştur</CardTitle>
						<CardDescription>
							Detaylı bir değerlendirme için tüm alanları doldurunuz
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Tabs value={currentTab} onValueChange={setCurrentTab}>
							<TabsList className="grid grid-cols-4 mb-8">
								{Object.keys(formSections).map((section) => (
									<TabsTrigger
										key={section}
										value={section}
										className="flex items-center gap-2"
									>
										{React.createElement(formSections[section].icon, {
											className: 'h-4 w-4'
										})}
										<span className="hidden sm:inline">
											{formSections[section].title}
										</span>
									</TabsTrigger>
								))}
							</TabsList>

							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-6"
								>
									{Object.entries(formSections).map(
										([sectionKey, section]) => (
											<TabsContent
												key={sectionKey}
												value={sectionKey}
												className="space-y-6"
											>
												{section.fields.map((fieldName) => (
													<FormField
														key={fieldName}
														control={form.control}
														name={fieldName}
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	{fieldLabels[fieldName]}
																</FormLabel>
																<FormControl>
																	{[
																		'education',
																		'workExperience',
																		'skills',
																		'projects',
																		'summary'
																	].includes(fieldName) ? (
																		<Textarea
																			{...field}
																			className="min-h-[100px]"
																			placeholder={
																				fieldPlaceholders[fieldName]
																			}
																		/>
																	) : (
																		<Input
																			{...field}
																			placeholder={
																				fieldPlaceholders[fieldName]
																			}
																		/>
																	)}
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
												))}
											</TabsContent>
										)
									)}

									<Button
										type="submit"
										className="w-full mt-6"
										disabled={loading}
									>
										{loading ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Değerlendiriliyor
											</>
										) : (
											<>
												<Send className="mr-2 h-4 w-4" />
												Yapay Zeka Değerlendirmesine Gönder
											</>
										)}
									</Button>
								</form>
							</Form>
						</Tabs>
					</CardContent>
				</Card>

				<Card className="p-6">
					<CardHeader>
						<CardTitle>Yapay Zeka Değerlendirmesi</CardTitle>
						<CardDescription>
							CV'nizin detaylı analizi ve öneriler
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ScrollArea className="h-[800px] pr-4">
							{loading ? (
								<div className="flex flex-col items-center justify-center h-64 space-y-4">
									<Loader2 className="h-8 w-8 animate-spin" />
									<p className="text-sm text-gray-500">
										CV'niz değerlendiriliyor...
									</p>
								</div>
							) : aiEvaluation.generalFeedback ? (
								<div className="space-y-6">
									<Alert className="bg-blue-50 border-blue-200">
										<AlertTitle>Genel Değerlendirme</AlertTitle>
										<AlertDescription>
											{aiEvaluation.generalFeedback}
										</AlertDescription>
									</Alert>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{aiEvaluation.strengths?.length > 0 && (
											<Alert className="bg-green-50 border-green-200">
												<AlertTitle className="flex items-center gap-2">
													<Award className="h-4 w-4" />
													Güçlü Yönler
												</AlertTitle>
												<AlertDescription>
													<ul className="list-disc pl-4 mt-2 space-y-1">
														{aiEvaluation.strengths.map(
															(strength, idx) => (
																<li key={idx}>{strength}</li>
															)
														)}
													</ul>
												</AlertDescription>
											</Alert>
										)}

										{aiEvaluation.weaknesses?.length > 0 && (
											<Alert className="bg-yellow-50 border-yellow-200">
												<AlertTitle className="flex items-center gap-2">
													<Code2 className="h-4 w-4" />
													Geliştirilmesi Gereken Yönler
												</AlertTitle>
												<AlertDescription>
													<ul className="list-disc pl-4 mt-2 space-y-1">
														{aiEvaluation.weaknesses.map(
															(weakness, idx) => (
																<li key={idx}>{weakness}</li>
															)
														)}
													</ul>
												</AlertDescription>
											</Alert>
										)}
									</div>

									{aiEvaluation.sections?.map((section, index) => (
										<Alert
											key={index}
											className="bg-gray-50 border-gray-200"
										>
											<AlertTitle>{section.title}</AlertTitle>
											<AlertDescription>
												<ul className="list-disc pl-4 mt-2 space-y-1">
													{section.suggestions?.map(
														(suggestion, idx) => (
															<li key={idx}>{suggestion}</li>
														)
													)}
												</ul>
											</AlertDescription>
										</Alert>
									))}

									{aiEvaluation.industryTrends?.length > 0 && (
										<Alert className="bg-purple-50 border-purple-200">
											<AlertTitle className="flex items-center gap-2">
												<Languages className="h-4 w-4" />
												Sektör Trendleri
											</AlertTitle>
											<AlertDescription>
												<ul className="list-disc pl-4 mt-2 space-y-1">
													{aiEvaluation.industryTrends.map(
														(trend, idx) => (
															<li key={idx}>{trend}</li>
														)
													)}
												</ul>
											</AlertDescription>
										</Alert>
									)}
								</div>
							) : (
								<div className="text-center text-gray-500 py-8">
									CV'nizi değerlendirmek için formu doldurup
									gönderiniz.
								</div>
							)}
						</ScrollArea>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

export default CVPage
