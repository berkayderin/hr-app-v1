// app/panel/page.jsx
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
	CheckCircle,
	Brain
} from 'lucide-react'
import { PrismaClient } from '@prisma/client'
import TestButton from '@/components/TestButton'
import SkillPersonalityTestButton from '@/components/SkillPersonalityTestButton'
import ProductOwnerSimulationButton from '@/components/ProductOwnerSimulationButton'

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

	const assignedSkillPersonalityTests =
		await prisma.assignedSkillPersonalityTest.findMany({
			where: {
				userId: session.user.id
			},
			include: {
				test: true
			}
		})

	return (
		<div className="container mx-auto p-4 space-y-6">
			<div className="text-2xl mb-4">
				Hoşgeldin,{' '}
				<span className="font-medium">{session.user.email}</span> 😎
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{session.user.role === 'admin' && (
					<>
						<Card className="bg-white">
							<CardHeader className="space-y-1">
								<CardTitle className="text-2xl flex items-center space-x-2">
									<ClipboardList className="h-6 w-6 text-primary" />
									<span>İngilizce Test Yönetimi</span>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">
									Yapay zeka destekli İngilizce testleri oluşturun ve
									yönetin.
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
						<Card className="bg-white">
							<CardHeader className="space-y-1">
								<CardTitle className="text-2xl flex items-center space-x-2">
									<Brain className="h-6 w-6 text-primary" />
									<span>Yetenek ve Kişilik Testi Yönetimi</span>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">
									Yapay zeka destekli yetenek ve kişilik testlerini
									oluşturun ve yönetin.
								</p>
							</CardContent>
							<CardFooter className="flex flex-col space-y-2">
								<Button
									asChild
									variant="outline"
									className="w-full hover:bg-primary hover:text-white transition-colors "
								>
									<Link href="/panel/skill-personality-test">
										<ClipboardList className="mr-2 h-4 w-4" />
										Yetenek ve Kişilik Testlerini Görüntüle
									</Link>
								</Button>
								<Button
									asChild
									variant="outline"
									className="w-full hover:bg-primary hover:text-white transition-colors "
								>
									<Link href="/panel/skill-personality-test/create">
										<PenTool className="mr-2 h-4 w-4" />
										Yetenek ve Kişilik Testi Oluştur
									</Link>
								</Button>
								<Button
									asChild
									variant="outline"
									className="w-full hover:bg-primary hover:text-white transition-colors "
								>
									<Link href="/panel/skill-personality-test/results">
										<BarChart className="mr-2 h-4 w-4" />
										Test Sonuçlarını Görüntüle
									</Link>
								</Button>
							</CardFooter>
						</Card>
					</>
				)}

				{session.user.role === 'user' && (
					<>
						<Card className="bg-white">
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
														? 'bg-gray-100 border-l-4 border-green-500'
														: 'bg-gray-100 hover:bg-gray-200'
												}`}
											>
												<div className="flex items-center justify-between">
													{assignedTest.completedAt ? (
														<div className="text-primary font-bold flex items-center space-x-2">
															<CheckCircle className="h-4 w-4 text-green-500" />
															<span>{assignedTest.test.title}</span>
														</div>
													) : (
														<TestButton assignedTest={assignedTest} />
													)}
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
										Henüz atanmış bir İngilizce testiniz
										bulunmamaktadır.
									</p>
								)}
							</CardContent>
						</Card>

						<Card className="bg-white">
							<CardHeader className="space-y-1">
								<CardTitle className="text-2xl flex items-center space-x-2">
									<Brain className="h-6 w-6 text-primary" />
									<span>Yetenek ve Kişilik Testlerim</span>
								</CardTitle>
							</CardHeader>
							<CardContent>
								{assignedSkillPersonalityTests.length > 0 ? (
									<ul className="space-y-2">
										{assignedSkillPersonalityTests.map(
											(assignedTest) => (
												<li
													key={assignedTest.id}
													className={`p-3 rounded-md transition-colors ${
														assignedTest.completedAt
															? 'bg-gray-100 border-l-4 border-green-500'
															: 'bg-gray-100 hover:bg-gray-200'
													}`}
												>
													<div className="flex items-center justify-between">
														{assignedTest.completedAt ? (
															<div className="text-primary font-bold flex items-center space-x-2">
																<CheckCircle className="h-4 w-4 text-green-500" />
																<span>{assignedTest.test.title}</span>
															</div>
														) : (
															<SkillPersonalityTestButton
																assignedTest={assignedTest}
															/>
														)}
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
											)
										)}
									</ul>
								) : (
									<p className="text-sm text-muted-foreground">
										Henüz atanmış bir yetenek ve kişilik testiniz
										bulunmamaktadır.
									</p>
								)}
							</CardContent>
						</Card>
					</>
				)}

				<Card className="bg-white">
					<CardHeader className="space-y-1">
						<CardTitle className="text-2xl flex items-center space-x-2">
							<Brain className="h-6 w-6 text-primary" />
							<span>Product Owner Simülasyonu</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground">
							Product Owner yeteneklerinizi test edin ve geliştirin.
						</p>
					</CardContent>
					<CardFooter>
						<ProductOwnerSimulationButton />
					</CardFooter>
				</Card>
			</div>
		</div>
	)
}
