// app/panel/english-test/results/page.jsx
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent
} from '@/components/ui/card'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const prisma = new PrismaClient()

export default async function ViewTestResultsPage() {
	const session = await getServerSession(authOptions)

	if (!session || session.user.role !== 'admin') {
		redirect('/login')
	}

	const results = await prisma.assignedTest.findMany({
		where: { completedAt: { not: null } },
		include: { user: true, test: true },
		orderBy: { completedAt: 'desc' }
	})

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-3xl font-bold mb-8 text-center">
				İngilizce Test Sonuçları
			</h1>
			<Link href="/panel/">
				<Button>Panele Geri Dön</Button>
			</Link>
			<Card>
				<CardHeader>
					<CardTitle>Tüm Test Sonuçları</CardTitle>
				</CardHeader>
				<CardContent>
					<ScrollArea className="h-[60vh]">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="font-bold">
										Kullanıcı
									</TableHead>
									<TableHead className="font-bold">Test</TableHead>
									<TableHead className="font-bold">Puan</TableHead>
									<TableHead className="font-bold">
										Tamamlanma Zamanı
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{results.map((result) => (
									<TableRow
										key={result.id}
										className="hover:bg-muted/50"
									>
										<TableCell>{result.user.email}</TableCell>
										<TableCell>{result.test.title}</TableCell>
										<TableCell>{result.score}</TableCell>
										<TableCell>
											{new Date(result.completedAt).toLocaleString(
												'tr-TR',
												{
													dateStyle: 'medium',
													timeStyle: 'short'
												}
											)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</ScrollArea>
				</CardContent>
			</Card>
		</div>
	)
}
