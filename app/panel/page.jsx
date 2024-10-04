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
	PenTool,
	User,
	BarChart,
	CheckCircle
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
		<div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
			<div className="container mx-auto p-6">
				<h1 className="text-4xl font-bold mb-8 text-primary text-center">
					Kontrol Paneli
				</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<Card className="bg-white dark:bg-gray-800">
						<CardHeader className="space-y-1">
							<CardTitle className="text-2xl flex items-center space-x-2">
								<User className="h-6 w-6 text-primary" />
								<span>Hesap Bilgilerim</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<p className="text-sm text-muted-foreground">
									<span className="font-semibold">E-posta:</span>{' '}
									{session.user.email}
								</p>
								<p className="text-sm text-muted-foreground">
									<span className="font-semibold">Rol:</span>{' '}
									{session.user.role}
								</p>
							</div>
						</CardContent>
						<CardFooter>
							<Button
								asChild
								variant="outline"
								className="w-full hover:bg-primary hover:text-white transition-colors "
							>
								<Link href="/panel/account">
									<Settings className="mr-2 h-4 w-4" />
									Hesap Ayarları
								</Link>
							</Button>
						</CardFooter>
					</Card>

					{session.user.role === 'admin' && (
						<>
							<Card className="bg-white dark:bg-gray-800">
								<CardHeader className="space-y-1">
									<CardTitle className="text-2xl flex items-center space-x-2">
										<Users className="h-6 w-6 text-primary" />
										<span>Kullanıcı Yönetimi</span>
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">
										Kullanıcıları yönetin ve rolleri düzenleyin.
									</p>
								</CardContent>
								<CardFooter>
									<Button
										asChild
										variant="outline"
										className="w-full hover:bg-primary hover:text-white transition-colors "
									>
										<Link href="/panel/users">
											<Users className="mr-2 h-4 w-4" />
											Kullanıcıları Yönet
										</Link>
									</Button>
								</CardFooter>
							</Card>

							<Card className="bg-white dark:bg-gray-800">
								<CardHeader className="space-y-1">
									<CardTitle className="text-2xl flex items-center space-x-2">
										<ClipboardList className="h-6 w-6 text-primary" />
										<span>İngilizce Test Yönetimi</span>
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">
										Yapay zeka destekli İngilizce testleri oluşturun
										ve yönetin.
									</p>
								</CardContent>
								<CardFooter className="flex flex-col space-y-2">
									<Button
										asChild
										variant="outline"
										className="w-full hover:bg-primary hover:text-white transition-colors "
									>
										<Link href="/panel/english-test">
											<ClipboardList className="mr-2 h-4 w-4" />
											İngilizce Testlerini Görüntüle
										</Link>
									</Button>
									<Button
										asChild
										variant="outline"
										className="w-full hover:bg-primary hover:text-white transition-colors "
									>
										<Link href="/panel/english-test/create">
											<PenTool className="mr-2 h-4 w-4" />
											İngilizce Testi Oluştur
										</Link>
									</Button>
									<Button
										asChild
										variant="outline"
										className="w-full hover:bg-primary hover:text-white transition-colors "
									>
										<Link href="/panel/english-test/results">
											<BarChart className="mr-2 h-4 w-4" />
											Test Sonuçlarını Görüntüle
										</Link>
									</Button>
								</CardFooter>
							</Card>
						</>
					)}

					{session.user.role === 'user' && (
						<Card className="bg-white dark:bg-gray-800">
							<CardHeader className="space-y-1">
								<CardTitle className="text-2xl flex items-center space-x-2">
									<BookOpen className="h-6 w-6 text-primary" />
									<span>İngilizce Testlerim</span>
								</CardTitle>
							</CardHeader>
							<CardContent>
								{assignedTests.length > 0 ? (
									<ul className="space-y-2">
										{assignedTests.map((assignedTest) => (
											<li
												key={assignedTest.id}
												className={`p-3 rounded-md transition-colors ${
													assignedTest.completedAt
														? 'bg-gray-100 dark:bg-gray-700 border-l-4 border-green-500'
														: 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
												}`}
											>
												<div className="flex items-center justify-between">
													{assignedTest.completedAt ? (
														<div className="text-primary font-bold flex items-center space-x-2">
															<CheckCircle className="h-4 w-4 text-green-500" />
															<span>{assignedTest.test.title}</span>
														</div>
													) : (
														<Link
															href={`/panel/english-test/take/${assignedTest.id}`}
															className="text-primary hover:text-primary-dark font-bold flex items-center space-x-2"
														>
															<ClipboardList className="h-4 w-4" />
															<span>{assignedTest.test.title}</span>
														</Link>
													)}
													{/* {assignedTest.completedAt && (
														<span className="text-sm text-gray-500">
															Puan: {assignedTest.score}
														</span>
													)} */}
												</div>
												{assignedTest.completedAt && (
													<p className="text-xs text-gray-500 mt-1">
														Tamamlandı:{' '}
														{new Date(
															assignedTest.completedAt
														).toLocaleString()}
													</p>
												)}
											</li>
										))}
									</ul>
								) : (
									<p className="text-sm text-muted-foreground">
										Henüz atanmış bir testiniz bulunmamaktadır.
									</p>
								)}
							</CardContent>
							<CardFooter>
								<Button
									asChild
									variant="outline"
									className="w-full hover:bg-primary hover:text-white transition-colors"
								>
									<Link href="/panel/english-test">
										<BookOpen className="mr-2 h-4 w-4" />
										Tüm Testleri Görüntüle
									</Link>
								</Button>
							</CardFooter>
						</Card>
					)}
				</div>

				<div className="mt-8 flex justify-end">
					<LogoutButton />
				</div>
			</div>
		</div>
	)
}
