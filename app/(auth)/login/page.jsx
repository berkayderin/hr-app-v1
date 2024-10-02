// app/login/page.jsx
'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { getSession, signIn } from 'next-auth/react'

const loginSchema = z.object({
	email: z
		.string()
		.email({ message: 'Geçerli bir e-posta adresi giriniz' }),
	password: z
		.string()
		.min(8, { message: 'Şifre en az 8 karakter olmalıdır' })
})

export default function LoginPage() {
	const [showPassword, setShowPassword] = useState(false)

	const { toast } = useToast()
	const router = useRouter()

	const form = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	})

	const onSubmit = async (data) => {
		try {
			const result = await signIn('credentials', {
				redirect: false,
				email: data.email,
				password: data.password
			})

			if (result.error) {
				throw new Error(result.error)
			}

			toast({
				title: 'Başarılı',
				description: 'Giriş başarılı, yönlendiriliyorsunuz...',
				variant: 'success'
			})

			// Kullanıcı rolüne göre yönlendirme
			const session = await getSession()
			if (session?.user?.role === 'admin') {
				router.push('/') // veya admin için uygun bir sayfa
			} else {
				router.push('/test') // normal kullanıcılar için profil sayfası
			}
		} catch (error) {
			console.error('Giriş hatası:', error)
			toast({
				title: 'Hata',
				description:
					error.message || 'Giriş yapılırken bir hata oluştu',
				variant: 'destructive'
			})
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle>Giriş Yap</CardTitle>
					<CardDescription>Hesabınıza giriş yapın</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-4"
						>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>E-posta</FormLabel>
										<FormControl>
											<Input
												placeholder="ornek@email.com"
												{...field}
											/>
										</FormControl>
										<FormMessage className="text-xs" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Şifre</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													type={showPassword ? 'text' : 'password'}
													placeholder="********"
													{...field}
												/>
												<button
													type="button"
													onClick={() =>
														setShowPassword(!showPassword)
													}
													className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
												>
													{showPassword ? (
														<EyeOff className="h-5 w-5" />
													) : (
														<Eye className="h-5 w-5" />
													)}
												</button>
											</div>
										</FormControl>
										<FormMessage className="text-xs" />
									</FormItem>
								)}
							/>
							<Button type="submit" className="w-full">
								Giriş Yap
							</Button>
						</form>
					</Form>
				</CardContent>
				<CardFooter className="flex justify-center">
					<Link
						href="/register"
						className="text-sm text-black hover:underline"
					>
						Hesabınız yok mu?{' '}
						<span className="font-semibold"> Kayıt olun </span>
					</Link>
				</CardFooter>
			</Card>
		</div>
	)
}
