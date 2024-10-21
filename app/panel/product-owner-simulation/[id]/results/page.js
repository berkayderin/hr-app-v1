// app/panel/product-owner-simulation/[id]/results/page.js
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prismadb'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function SimulationResultsPage({ params }) {
	const session = await getServerSession(authOptions)

	if (!session) {
		redirect('/login')
	}

	const simulation = await prisma.productOwnerSimulation.findUnique({
		where: { id: params.id }
	})

	if (!simulation || simulation.userId !== session.user.id) {
		redirect('/panel/product-owner-simulation')
	}

	return (
		<div className="container mx-auto p-4 space-y-6">
			<h1 className="text-2xl font-bold">Simülasyon Sonuçları</h1>
			<div className="bg-white shadow rounded-lg p-6">
				<h2 className="text-xl font-semibold mb-4">
					Toplam Puan: {simulation.score}
				</h2>
			</div>
			<Button asChild>
				<Link href="/panel">Panele Dön</Link>
			</Button>
		</div>
	)
}
