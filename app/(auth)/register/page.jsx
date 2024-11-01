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
import SparklesText from '@/components/ui/sparkles-text'

export default function RegisterPage() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
			<SparklesText
				text="EvalTalent"
				className="text-5xl font-bold my-5"
			/>
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle>Kayıt Ol</CardTitle>
					<CardDescription>Yeni bir hesap oluşturun</CardDescription>
				</CardHeader>
				<CardContent>
					<RegisterForm />
				</CardContent>
				<CardFooter className="flex flex-col justify-center gap-2">
					<Link
						href="/login"
						className="text-sm text-black hover:underline"
					>
						Zaten hesabınız var mı?{' '}
						<span className="font-semibold"> Giriş Yapın </span>
					</Link>
					<Link
						href="/"
						className="text-sm text-black hover:underline"
					>
						Geri dön
					</Link>
				</CardFooter>
			</Card>
		</div>
	)
}
