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
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { DataTable } from './components/datatable'
import { columns } from './components/englishResultColumns'

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

	console.log('Fetched results:', results)

	return (
		<div className="container mx-auto p-6">
			<Breadcrumb className="mb-4">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/panel">Ana Sayfa</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href="/panel/english-test">
							İngilizce Testleri
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage className="font-medium">
							Test Sonuçları
						</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<Card>
				<CardHeader>
					<CardTitle>İngilizce Test Sonuçları</CardTitle>
				</CardHeader>
				<CardContent>
					<DataTable columns={columns} data={results} />
				</CardContent>
			</Card>
		</div>
	)
}
