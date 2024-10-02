'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import {
	RadioGroup,
	RadioGroupItem
} from '@/components/ui/radio-group'

const TestForm = ({ test, userId }) => {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const { toast } = useToast()
	const router = useRouter()

	// Dinamik olarak schema oluştur
	const schemaFields = {}
	test.questions.forEach((question, index) => {
		schemaFields[`question_${index}`] = z.string({
			required_error: 'Bu soru cevaplanmalıdır.'
		})
	})
	const testSchema = z.object(schemaFields)

	const form = useForm({
		resolver: zodResolver(testSchema),
		defaultValues: test.questions.reduce((acc, _, index) => {
			acc[`question_${index}`] = ''
			return acc
		}, {})
	})

	const onSubmit = async (data) => {
		setIsSubmitting(true)
		try {
			const response = await fetch('/api/tests/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					testId: test.id,
					userId: userId,
					answers: data
				})
			})

			if (!response.ok) {
				throw new Error('Test gönderimi başarısız oldu')
			}

			toast({
				title: 'Başarılı',
				description: 'Testiniz başarıyla gönderildi.'
			})

			router.push('/panel')
		} catch (error) {
			console.error('Test gönderme hatası:', error)
			toast({
				title: 'Hata',
				description: 'Testiniz gönderilirken bir hata oluştu.',
				variant: 'destructive'
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-8"
			>
				{test.questions.map((question, index) => (
					<FormField
						key={index}
						control={form.control}
						name={`question_${index}`}
						render={({ field }) => (
							<FormItem className="space-y-3">
								<FormLabel>{question.text}</FormLabel>
								<FormControl>
									<RadioGroup
										onValueChange={field.onChange}
										defaultValue={field.value}
										className="flex flex-col space-y-1"
									>
										{question.options.map((option, optionIndex) => (
											<FormItem
												className="flex items-center space-x-3 space-y-0"
												key={optionIndex}
											>
												<FormControl>
													<RadioGroupItem value={option} />
												</FormControl>
												<FormLabel className="font-normal">
													{option}
												</FormLabel>
											</FormItem>
										))}
									</RadioGroup>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				))}
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? 'Gönderiliyor...' : 'Testi Gönder'}
				</Button>
			</form>
		</Form>
	)
}

export default TestForm
