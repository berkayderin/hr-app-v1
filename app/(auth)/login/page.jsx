// app/login/page.jsx
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
import LoginForm from '@/features/auth/components/LoginForm'

export default function LoginPage() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle>Giriş Yap</CardTitle>
					<CardDescription>Hesabınıza giriş yapın</CardDescription>
				</CardHeader>
				<CardContent>
					<LoginForm />
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
