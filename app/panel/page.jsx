import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent
} from '@/components/ui/card'
import LogoutButton from '@/components/main/LogoutButton'

export default async function PanelPage() {
	const session = await getServerSession(authOptions)

	if (!session) {
		redirect('/login')
	}

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-6">Kontrol Paneli</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<Card>
					<CardHeader>
						<CardTitle>Hesap Bilgileri</CardTitle>
					</CardHeader>
					<CardContent>
						<p>E-posta: {session.user.email}</p>
						<p>Rol: {session.user.role}</p>
						<Link
							href="/panel/account"
							className="text-blue-500 hover:underline"
						>
							Hesap Ayarları
						</Link>
					</CardContent>
				</Card>

				{session.user.role === 'admin' && (
					<Card>
						<CardHeader>
							<CardTitle>Kullanıcı Yönetimi</CardTitle>
						</CardHeader>
						<CardContent>
							<Link
								href="/panel/users"
								className="text-blue-500 hover:underline"
							>
								Kullanıcıları Yönet
							</Link>
						</CardContent>
					</Card>
				)}

				<Card>
					<CardHeader>
						<CardTitle>Testler</CardTitle>
					</CardHeader>
					<CardContent>
						<Link
							href="/panel/tests"
							className="text-blue-500 hover:underline"
						>
							Testleri Görüntüle
						</Link>
					</CardContent>
				</Card>

				<LogoutButton />
			</div>
		</div>
	)
}
