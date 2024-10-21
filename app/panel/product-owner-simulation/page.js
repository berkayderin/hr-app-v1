// app/panel/product-owner-simulation/page.js
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import prisma from '@/lib/prismadb'

export default async function ProductOwnerSimulationPage() {
	const session = await getServerSession(authOptions)

	if (!session) {
		redirect('/login')
	}

	const activeSimulation =
		await prisma.productOwnerSimulation.findFirst({
			where: {
				userId: session.user.id,
				completedAt: null
			}
		})

	async function startNewSimulation() {
		'use server'
		const newSimulation = await prisma.productOwnerSimulation.create({
			data: {
				userId: session.user.id,
				currentTask: 'teamMeeting'
			}
		})
		redirect(`/panel/product-owner-simulation/${newSimulation.id}`)
	}

	return (
		<div className="container mx-auto p-4 space-y-6">
			<h1 className="text-2xl font-bold">
				Product Owner Simülasyonu
			</h1>
			{activeSimulation ? (
				<div>
					<p>Devam eden bir simülasyonunuz var.</p>
					<Button asChild>
						<Link
							href={`/panel/product-owner-simulation/${activeSimulation.id}`}
						>
							Simülasyona Devam Et
						</Link>
					</Button>
				</div>
			) : (
				<form action={startNewSimulation}>
					<Button type="submit">Yeni Simülasyon Başlat</Button>
				</form>
			)}
		</div>
	)
}
