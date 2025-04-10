// features/auth/components/LoginForm.jsx
'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import useAuth from '../queries/useAuth'

const loginSchema = z.object({
	email: z
		.string()
		.email({ message: 'Geçerli bir e-posta adresi giriniz' }),
	password: z
		.string()
		.min(8, { message: 'Şifre en az 8 karakter olmalıdır' })
})

export default function LoginForm() {
	const [showPassword, setShowPassword] = useState(false)
	const { useLogin } = useAuth()
	const login = useLogin()

	const form = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	})

	const onSubmit = (data) => {
		login.mutate(data)
	}

	return (
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
								<Input placeholder="ornek@email.com" {...field} />
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
										onClick={() => setShowPassword(!showPassword)}
										className="absolute inset-y-0 right-4 pr-3 flex items-center text-gray-400 hover:text-gray-600"
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
	)
}
