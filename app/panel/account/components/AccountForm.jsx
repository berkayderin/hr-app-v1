// app/panel/account/components/AccountForm.jsx
'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
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
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { User, Lock, Mail, ArrowLeft } from 'lucide-react'

const accountSchema = z
	.object({
		email: z
			.string()
			.email({ message: 'Geçerli bir e-posta adresi giriniz' }),
		currentPassword: z
			.string()
			.min(1, { message: 'Mevcut şifre gereklidir' }),
		newPassword: z
			.string()
			.min(8, { message: 'Yeni şifre en az 8 karakter olmalıdır' })
			.optional()
			.or(z.literal('')),
		confirmNewPassword: z.string().optional().or(z.literal(''))
	})
	.refine(
		(data) => {
			if (
				data.newPassword &&
				data.newPassword !== data.confirmNewPassword
			) {
				return false
			}
			return true
		},
		{
			message: 'Yeni şifreler eşleşmiyor',
			path: ['confirmNewPassword']
		}
	)
	.refine(
		(data) => {
			if (data.newPassword && !data.currentPassword) {
				return false
			}
			return true
		},
		{
			message:
				'Yeni şifre belirlemek için mevcut şifrenizi girmelisiniz',
			path: ['currentPassword']
		}
	)

const AccountForm = ({ user }) => {
	const [isLoading, setIsLoading] = useState(false)
	const { toast } = useToast()

	const form = useForm({
		resolver: zodResolver(accountSchema),
		defaultValues: {
			email: user.email,
			currentPassword: '',
			newPassword: '',
			confirmNewPassword: ''
		}
	})

	const onSubmit = async (data) => {
		setIsLoading(true)
		try {
			const response = await fetch('/api/account/update', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(
					errorData.message || 'Hesap güncelleme başarısız oldu'
				)
			}

			toast({
				title: 'Başarılı',
				description: 'Hesap bilgileriniz güncellendi.',
				duration: 3000
			})

			form.reset({
				email: data.email,
				currentPassword: '',
				newPassword: '',
				confirmNewPassword: ''
			})
		} catch (error) {
			console.error('Hesap güncelleme hatası:', error)
			toast({
				title: 'Hata',
				description:
					error.message ||
					'Hesap bilgileriniz güncellenirken bir hata oluştu.',
				variant: 'destructive',
				duration: 3000
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-6"
			>
				<div>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="flex items-center space-x-2">
									<Mail className="w-4 h-4" />
									<span>E-posta</span>
								</FormLabel>
								<FormControl>
									<Input
										{...field}
										className="bg-gray-50 dark:bg-gray-700"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div>
					<FormField
						control={form.control}
						name="currentPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="flex items-center space-x-2">
									<Lock className="w-4 h-4" />
									<span>Mevcut Şifre</span>
								</FormLabel>
								<FormControl>
									<Input
										type="password"
										{...field}
										className="bg-gray-50 dark:bg-gray-700"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div>
					<FormField
						control={form.control}
						name="newPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="flex items-center space-x-2">
									<Lock className="w-4 h-4" />
									<span>Yeni Şifre (Opsiyonel)</span>
								</FormLabel>
								<FormControl>
									<Input
										type="password"
										{...field}
										className="bg-gray-50 dark:bg-gray-700"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div>
					<FormField
						control={form.control}
						name="confirmNewPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="flex items-center space-x-2">
									<Lock className="w-4 h-4" />
									<span>Yeni Şifre Tekrar</span>
								</FormLabel>
								<FormControl>
									<Input
										type="password"
										{...field}
										className="bg-gray-50 dark:bg-gray-700"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="flex justify-end gap-4">
					<Link href="/panel">
						<Button
							variant="outline"
							className="flex items-center space-x-2"
						>
							<ArrowLeft className="w-4 h-4" />
							<span>Geri Dön</span>
						</Button>
					</Link>
					<Button
						type="submit"
						disabled={isLoading}
						className="flex items-center space-x-2"
					>
						<User className="w-4 h-4" />
						<span>{isLoading ? 'Güncelleniyor...' : 'Güncelle'}</span>
					</Button>
				</div>
			</form>
		</Form>
	)
}

export default AccountForm
