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
				description: 'Hesap bilgileriniz güncellendi.'
			})

			// Formu sıfırla
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
				variant: 'destructive'
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-8"
			>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>E-posta</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="currentPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Mevcut Şifre</FormLabel>
							<FormControl>
								<Input type="password" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="newPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Yeni Şifre (Opsiyonel)</FormLabel>
							<FormControl>
								<Input type="password" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="confirmNewPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Yeni Şifre Tekrar</FormLabel>
							<FormControl>
								<Input type="password" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" disabled={isLoading}>
					{isLoading ? 'Güncelleniyor...' : 'Güncelle'}
				</Button>
			</form>
		</Form>
	)
}

export default AccountForm
