import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
			<h1 className="text-4xl font-bold mb-6">
				HR Uygulamasına Hoş Geldiniz
			</h1>
			<p className="text-xl mb-8">
				İnsan Kaynakları yönetimi artık daha kolay!
			</p>
			<div className="space-x-4">
				<Link href="/login">
					<Button>Giriş Yap</Button>
				</Link>
				<Link href="/register">
					<Button variant="outline">Kayıt Ol</Button>
				</Link>
			</div>
		</div>
	)
}
