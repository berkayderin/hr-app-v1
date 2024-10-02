import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import LogoutButton from '@/components/main/LogoutButton'
import { Users, ClipboardList, Settings } from 'lucide-react'

export default async function PanelPage() {
	const session = await getServerSession(authOptions)

	if (!session) {
		redirect('/login')
	}

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-3xl font-bold mb-8 text-primary">
				Kontrol Paneli
			</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<Card>
					<CardHeader className="space-y-1">
						<CardTitle className="text-2xl">
							Hesap Bilgileri
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<p className="text-sm text-muted-foreground">
								E-posta: {session.user.email}
							</p>
							<p className="text-sm text-muted-foreground">
								Rol: {session.user.role}
							</p>
						</div>
					</CardContent>
					<CardFooter>
						<Button asChild variant="outline" className="w-full">
							<Link href="/panel/account">
								<Settings className="mr-2 h-4 w-4" />
								Hesap Ayarları
							</Link>
						</Button>
					</CardFooter>
				</Card>

				{session.user.role === 'admin' && (
					<Card>
						<CardHeader className="space-y-1">
							<CardTitle className="text-2xl">
								Kullanıcı Yönetimi
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">
								Kullanıcıları yönetin ve rolleri düzenleyin.
							</p>
						</CardContent>
						<CardFooter>
							<Button asChild variant="outline" className="w-full">
								<Link href="/panel/users">
									<Users className="mr-2 h-4 w-4" />
									Kullanıcıları Yönet
								</Link>
							</Button>
						</CardFooter>
					</Card>
				)}

				<Card>
					<CardHeader className="space-y-1">
						<CardTitle className="text-2xl">Testler</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground">
							Mevcut testleri görüntüleyin ve yönetin.
						</p>
					</CardContent>
					<CardFooter>
						<Button asChild variant="outline" className="w-full">
							<Link href="/panel/tests">
								<ClipboardList className="mr-2 h-4 w-4" />
								Testleri Görüntüle
							</Link>
						</Button>
					</CardFooter>
				</Card>
			</div>

			<div className="mt-8 flex justify-end">
				<LogoutButton />
			</div>
		</div>
	)
}
