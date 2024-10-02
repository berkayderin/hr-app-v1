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
			<h1 className="text-3xl font-bold mb-8">
				English Test Results
			</h1>
			<Card>
				<CardHeader>
					<CardTitle>All Test Results</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>User</TableHead>
								<TableHead>Test</TableHead>
								<TableHead>Score</TableHead>
								<TableHead>Completed At</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{results.map((result) => (
								<TableRow key={result.id}>
									<TableCell>{result.user.email}</TableCell>
									<TableCell>{result.test.title}</TableCell>
									<TableCell>{result.score}</TableCell>
									<TableCell>
										{result.completedAt.toLocaleString()}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	)
}
