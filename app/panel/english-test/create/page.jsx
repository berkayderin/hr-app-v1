// app/panel/english-test/create/page.jsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
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
import { Loader2, BookOpen, FileText } from 'lucide-react'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { toast } from 'sonner'

const formSchema = z.object({
	title: z
		.string()
		.min(3, { message: 'Başlık en az 3 karakter olmalıdır.' })
		.max(100, { message: 'Başlık en fazla 100 karakter olabilir.' }),
	level: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'], {
		required_error: 'Lütfen bir seviye seçin.'
	}),
	prompt: z
		.string()
		.min(10, { message: 'Yönerge en az 10 karakter olmalıdır.' })
		.max(500, { message: 'Yönerge en fazla 500 karakter olabilir.' })
})

export default function CreateEnglishTestPage() {
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			level: undefined,
			prompt: ''
		}
	})

	const onSubmit = async (values) => {
		setIsLoading(true)

		try {
			const response = await fetch('/api/english-test/create', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(values)
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || 'Test oluşturulamadı')
			}

			toast.success('Test başarıyla oluşturuldu')
			router.push('/panel/english-test')
		} catch (error) {
			console.error('Test oluşturma hatası:', error)
			toast.error('Test oluşturulurken bir hata oluştu')
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

			<div className="max-w-lg border border-gray-200 rounded-lg p-6">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Test Başlığı</FormLabel>
									<FormControl>
										<Input
											placeholder="Satış Departmanı İngilizce Testi"
											icon={
												<FileText className="h-4 w-4 text-gray-500" />
											}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="level"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Seviye</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Seviye Seçin" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="A1">A1</SelectItem>
											<SelectItem value="A2">A2</SelectItem>
											<SelectItem value="B1">B1</SelectItem>
											<SelectItem value="B2">B2</SelectItem>
											<SelectItem value="C1">C1</SelectItem>
											<SelectItem value="C2">C2</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="prompt"
							render={({ field }) => (
								<FormItem>
									<FormLabel>AI soru üretmesi için yönerge</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Satış departmanı için bir ingilizce testi oluşturun"
											className="min-h-[100px]"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							disabled={isLoading}
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
					</form>
				</Form>
			</div>
		</div>
	)
}
