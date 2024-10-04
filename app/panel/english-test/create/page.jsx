// app/panel/english-test/create/page.jsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Loader2, BookOpen, FileText } from 'lucide-react'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

export default function CreateEnglishTestPage() {
	const [title, setTitle] = useState('')
	const [level, setLevel] = useState('')
	const [prompt, setPrompt] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [isFormValid, setIsFormValid] = useState(false)
	const router = useRouter()
	const { toast } = useToast()

	useEffect(() => {
		setIsFormValid(
			title.trim() !== '' && level !== '' && prompt.trim() !== ''
		)
	}, [title, level, prompt])

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (!isFormValid) return
		setIsLoading(true)

		try {
			const response = await fetch('/api/english-test/create', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title, level, prompt })
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || 'Test oluşturulamadı')
			}

			toast({
				title: 'Başarılı',
				description: 'Test başarıyla oluşturuldu',
				duration: 3000
			})
			router.push('/panel/english-test')
		} catch (error) {
			console.error('Test oluşturma hatası:', error)
			toast({
				variant: 'destructive',
				title: 'Hata',
				description:
					error instanceof Error
						? error.message
						: 'Beklenmeyen bir hata oluştu',
				duration: 5000
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="container mx-auto p-4">
			<Breadcrumb className="mb-4">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/panel">Ana Sayfa</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href="/panel/english-test">
							İngilizce Testleri
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage className="font-medium">
							Test Oluştur
						</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<div className="max-w-lg border border-gray-200rounded-lg p-6 rounded-lg">
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
						<label
							htmlFor="title"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Test Başlığı
						</label>
						<Input
							id="title"
							placeholder="Test Başlığı"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
							className="w-full"
							icon={<FileText className="h-4 w-4 text-gray-500" />}
						/>
					</div>
					<div className="space-y-2">
						<label
							htmlFor="level"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Seviye
						</label>
						<Select value={level} onValueChange={setLevel} required>
							<SelectTrigger id="level" className="w-full">
								<SelectValue placeholder="Seviye Seçin" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="B1">B1</SelectItem>
								<SelectItem value="B2">B2</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<label
							htmlFor="prompt"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							AI Soru Üretme Yönergesi
						</label>
						<Textarea
							id="prompt"
							placeholder="AI'nın soru üretmesi için yönerge girin"
							value={prompt}
							onChange={(e) => setPrompt(e.target.value)}
							required
							className="w-full min-h-[100px]"
						/>
					</div>
				</form>
				<div className="mt-6">
					<Button
						type="submit"
						onClick={handleSubmit}
						disabled={isLoading || !isFormValid}
						className="w-full"
					>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Oluşturuluyor...
							</>
						) : (
							<>
								<BookOpen className="mr-2 h-4 w-4" />
								Testi Oluştur
							</>
						)}
					</Button>
				</div>
			</div>
		</div>
	)
}
