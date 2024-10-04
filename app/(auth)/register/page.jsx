// app/register/page.jsx
import React from 'react'
import Link from 'next/link'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import RegisterForm from '@/features/auth/components/RegisterForm'

export default function RegisterPage() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle>Kayıt Ol</CardTitle>
					<CardDescription>Yeni bir hesap oluşturun</CardDescription>
				</CardHeader>
				<CardContent>
					<RegisterForm />
				</CardContent>
				<CardFooter className="flex justify-center">
					<Link
						href="/login"
						className="text-sm text-black hover:underline"
					>
						Zaten hesabınız var mı?{' '}
						<span className="font-semibold"> Giriş Yapın </span>
					</Link>
				</CardFooter>
			</Card>
		</div>
	)
}
