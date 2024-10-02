import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prismadb'
import TestForm from './components/TestForm'

export default async function TestPage({ params }) {
	const session = await getServerSession(authOptions)

	if (!session) {
		redirect('/login')
	}

	const test = await prisma.test.findUnique({
		where: { id: params.id },
		include: { assignedTo: true }
	})

	if (
		!test ||
		!test.assignedTo.some((user) => user.id === session.user.id)
	) {
		redirect('/panel')
	}

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-6">{test.title}</h1>
			<p className="mb-4">{test.description}</p>
			<div className="max-w-2xl mx-auto">
				<TestForm test={test} userId={session.user.id} />
			</div>
		</div>
	)
}
