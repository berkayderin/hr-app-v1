// app/panel/skill-personality-test/create/page.jsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
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
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
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

const formSchema = z.object({
	title: z
		.string()
		.min(3, { message: 'Test başlığı en az 3 karakter olmalıdır.' })
		.max(100, {
			message: 'Test başlığı en fazla 100 karakter olabilir.'
		})
		.regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, {
			message: 'Test başlığı sadece harf ve boşluk içerebilir.'
		}),
	prompt: z
		.string()
		.min(20, { message: 'Yönerge en az 20 karakter olmalıdır.' })
		.max(1000, {
			message: 'Yönerge en fazla 1000 karakter olabilir.'
		})
})

export default function CreateSkillPersonalityTestPage() {
	const router = useRouter()

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			prompt: ''
		}
	})

	const onSubmit = async (values) => {
		try {
			const response = await fetch(
				'/api/skill-personality-test/create',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(values)
				}
			)

			if (!response.ok) {
				throw new Error('Failed to create test')
			}

			toast.success('Test başarıyla oluşturuldu')
			router.push('/panel/skill-personality-test')
		} catch (error) {
			console.error('Test creation error:', error)
			toast.error('Test oluşturulurken bir hata oluştu')
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

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<Card>
						<CardHeader>
							<CardTitle>Yeni Test Oluştur</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Test Başlığı</FormLabel>
										<FormControl>
											<Input
												placeholder="Satış ve Pazarlama Ekibi"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="prompt"
								render={({ field }) => (
									<FormItem>
										<FormLabel>AI Soru Üretme Yönergesi</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Satış ve pazarlama departmanına alınacak adaylar için test hazırla. Test şunları ölçmeli:
- Müşteri ilişkileri yönetimi becerileri
- İkna ve müzakere kabiliyeti
- Stres altında çalışabilme
- Problem çözme yaklaşımı
- Sosyal medya ve dijital pazarlama anlayışı
Senaryolar gerçek satış durumlarını içermeli. Özellikle zor müşterilerle başa çıkma, satış hedeflerine ulaşma baskısı ve takım içi rekabet gibi durumlar değerlendirilmeli."
												className="min-h-[200px]"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
						<CardFooter>
							<Button
								type="submit"
								disabled={form.formState.isSubmitting}
							>
								{form.formState.isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Oluşturuluyor...
									</>
								) : (
									<>
										<Save className="mr-2 h-4 w-4" />
										Testi Oluştur
									</>
								)}
							</Button>
						</CardFooter>
					</Card>
				</form>
			</Form>
		</div>
	)
}
