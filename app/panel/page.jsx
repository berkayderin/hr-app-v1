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
import {
	Users,
	ClipboardList,
	Settings,
	BookOpen,
	PenTool
} from 'lucide-react'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function PanelPage() {
	const session = await getServerSession(authOptions)

	if (!session) {
		redirect('/login')
	}

	const assignedTests = await prisma.assignedTest.findMany({
		where: {
			userId: session.user.id
		},
		include: {
			test: true
		}
	})

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
					<>
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

						<Card>
							<CardHeader className="space-y-1">
								<CardTitle className="text-2xl">
									İngilizce Test Yönetimi
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">
									Yapay zeka destekli İngilizce testleri oluşturun ve
									yönetin.
								</p>
							</CardContent>
							<CardFooter className="flex flex-col space-y-2">
								<Button asChild variant="outline" className="w-full">
									<Link href="/panel/english-test">
										<ClipboardList className="mr-2 h-4 w-4" />
										İngilizce Testlerini Görüntüle
									</Link>
								</Button>
								<Button asChild variant="outline" className="w-full">
									<Link href="/panel/english-test/create">
										<PenTool className="mr-2 h-4 w-4" />
										İngilizce Testi Oluştur
									</Link>
								</Button>
								<Button asChild variant="outline" className="w-full">
									<Link href="/panel/english-test/results">
										<BookOpen className="mr-2 h-4 w-4" />
										Test Sonuçlarını Görüntüle
									</Link>
								</Button>
							</CardFooter>
						</Card>
					</>
				)}

				{session.user.role === 'user' && (
					<Card>
						<CardHeader className="space-y-1">
							<CardTitle className="text-2xl">
								İngilizce Testlerim
							</CardTitle>
						</CardHeader>
						<CardContent>
							{assignedTests.length > 0 ? (
								<ul className="space-y-2">
									{assignedTests.map((assignedTest) => (
										<li key={assignedTest.id}>
											<Link
												href={`/panel/english-test/take/${assignedTest.id}`}
												className="text-blue-500 hover:underline font-bold"
											>
												{assignedTest.test.title}
											</Link>
										</li>
									))}
								</ul>
							) : (
								<p className="text-sm text-muted-foreground">
									Henüz atanmış bir testiniz bulunmamaktadır.
								</p>
							)}
						</CardContent>
					</Card>
				)}
			</div>

			<div className="mt-8 flex justify-end">
				<LogoutButton />
			</div>
		</div>
	)
}
