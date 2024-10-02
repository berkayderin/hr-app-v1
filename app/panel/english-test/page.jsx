// app/panel/english-test/page.jsx
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent
} from '@/components/ui/card'
import prisma from '@/lib/prismadb'

export default async function ViewEnglishTestsPage() {
	const session = await getServerSession(authOptions)

	if (!session) {
		redirect('/login')
	}

	let tests = []
	try {
		tests = await prisma.englishTest.findMany({
			orderBy: { createdAt: 'desc' }
		})
	} catch (error) {
		console.error('Failed to fetch English tests:', error)
	}

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-3xl font-bold mb-8">English Tests</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{tests.map((test) => (
					<Card key={test.id}>
						<CardHeader>
							<CardTitle>{test.title}</CardTitle>
						</CardHeader>
						<CardContent>
							<p>Level: {test.level}</p>
							<p>Questions: {test.questions.length}</p>
							<Button asChild className="mt-4">
								<Link href={`/panel/english-test/${test.id}`}>
									View Details
								</Link>
							</Button>
						</CardContent>
					</Card>
				))}
			</div>
			{session.user.role === 'admin' && (
				<Button asChild className="mt-8">
					<Link href="/panel/english-test/create">
						Create New Test
					</Link>
				</Button>
			)}
		</div>
	)
}
