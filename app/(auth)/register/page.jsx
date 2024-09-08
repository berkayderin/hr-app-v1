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

const registerSchema = z
	.object({
		name: z
			.string()
			.min(2, { message: 'İsim en az 2 karakter olmalıdır' }),
		email: z
			.string()
			.email({ message: 'Geçerli bir e-posta adresi giriniz' }),
		password: z
			.string()
			.min(8, { message: 'Şifre en az 8 karakter olmalıdır' }),
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Şifreler eşleşmiyor',
		path: ['confirmPassword']
	})

export default function RegisterPage() {
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] =
		useState(false)

	const form = useForm({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: ''
		}
	})

	const onSubmit = (data) => {
		console.log('Kayıt verileri:', data)
		// Burada normalde kayıt API'nize bir istek yapardınız
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle>Kayıt Ol</CardTitle>
					<CardDescription>Yeni bir hesap oluşturun</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-4"
						>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>İsim</FormLabel>
										<FormControl>
											<Input
												placeholder="Adınız Soyadınız"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
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
										<FormMessage />
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
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Şifre Tekrarı</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													type={
														showConfirmPassword ? 'text' : 'password'
													}
													placeholder="********"
													{...field}
												/>
												<button
													type="button"
													onClick={() =>
														setShowConfirmPassword(
															!showConfirmPassword
														)
													}
													className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
												>
													{showConfirmPassword ? (
														<EyeOff className="h-5 w-5" />
													) : (
														<Eye className="h-5 w-5" />
													)}
												</button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" className="w-full">
								Kayıt Ol
							</Button>
						</form>
					</Form>
				</CardContent>
				<CardFooter className="flex justify-center">
					<Link
						href="/login"
						className="text-sm text-blue-600 hover:underline"
					>
						Zaten hesabınız var mı? Giriş yapın
					</Link>
				</CardFooter>
			</Card>
		</div>
	)
}
