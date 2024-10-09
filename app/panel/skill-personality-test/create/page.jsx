// app/panel/skill-personality-test/create/page.jsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter
} from '@/components/ui/card'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

export default function CreateSkillPersonalityTestPage() {
	const [title, setTitle] = useState('')
	const [prompt, setPrompt] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()

	const handleSubmit = async (e) => {
		e.preventDefault()
		setIsLoading(true)
		try {
			const response = await fetch(
				'/api/skill-personality-test/create',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ title, prompt })
				}
			)
			if (!response.ok) throw new Error('Failed to create test')
			toast.success('Test created successfully')
			router.push('/panel/skill-personality-test')
		} catch (error) {
			toast.error('Failed to create test')
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
						<BreadcrumbLink href="/panel/skill-personality-test">
							Yetenek ve Kişilik Testleri
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

			<form onSubmit={handleSubmit}>
				<Card>
					<CardHeader></CardHeader>
					<CardContent className="space-y-4">
						<div>
							<label
								htmlFor="title"
								className="block text-sm font-medium text-gray-700"
							>
								Test Başlığı
							</label>
							<Input
								id="title"
								placeholder="Test Başlığı"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
							/>
						</div>
						<div>
							<label
								htmlFor="prompt"
								className="block text-sm font-medium text-gray-700"
							>
								AI Soru Üretme Yönergesi
							</label>
							<Textarea
								id="prompt"
								placeholder="AI'nın soru üretmesi için yönerg girin"
								value={prompt}
								onChange={(e) => setPrompt(e.target.value)}
								rows={4}
								required
							/>
						</div>
					</CardContent>
					<CardFooter>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Oluşturuluyor...
								</>
							) : (
								<>
									<Save className="mr-2 h-4 w-4" /> Testi Oluştur
								</>
							)}
						</Button>
					</CardFooter>
				</Card>
			</form>
		</div>
	)
}
