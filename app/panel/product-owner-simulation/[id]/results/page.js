// app/panel/product-owner-simulation/[id]/results/page.js
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/AuthOptions'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prismadb'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent
} from '@/components/ui/card'
import { Trophy, Home } from 'lucide-react'
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

	const getScoreLevel = (score) => {
		if (score >= 90)
			return { text: 'Mükemmel', color: 'text-green-500' }
		if (score >= 75) return { text: 'İyi', color: 'text-blue-500' }
		if (score >= 60) return { text: 'Orta', color: 'text-yellow-500' }
		return { text: 'Geliştirilebilir', color: 'text-red-500' }
	}

	const scoreLevel = getScoreLevel(simulation.score)

	return (
		<div className="container max-w-2xl mx-auto p-4 space-y-8">
			<Card className="border-0 shadow-lg">
				<CardHeader className="text-center pb-8 border-b">
					<div className="flex justify-center mb-4">
						<Trophy className="h-16 w-16 text-yellow-400" />
					</div>
					<CardTitle className="text-3xl mb-2">
						Mülakat Tamamlandı
					</CardTitle>
					<p className="text-gray-500">
						Product Owner Pozisyonu Değerlendirme Sonuçları
					</p>
				</CardHeader>
				<CardContent className="pt-8">
					<div className="space-y-8">
						<div className="bg-gray-50 rounded-lg p-6 text-center">
							<div className="text-5xl font-bold mb-2">
								{simulation.score}
							</div>
							<div
								className={`text-lg font-medium ${scoreLevel.color}`}
							>
								{scoreLevel.text}
							</div>
						</div>

						<div className="grid gap-4">
							<div className="flex justify-between items-center p-4 bg-white rounded-lg border">
								<div>
									<div className="font-medium">Takım İletişimi</div>
									<div className="text-sm text-gray-500">
										İletişim becerileri
									</div>
								</div>
								<div className="text-lg font-semibold">
									{simulation.teamMeetingScore || 0}/100
								</div>
							</div>
							<div className="flex justify-between items-center p-4 bg-white rounded-lg border">
								<div>
									<div className="font-medium">Backlog Yönetimi</div>
									<div className="text-sm text-gray-500">
										Önceliklendirme
									</div>
								</div>
								<div className="text-lg font-semibold">
									{simulation.backlogScore || 0}/100
								</div>
							</div>
							<div className="flex justify-between items-center p-4 bg-white rounded-lg border">
								<div>
									<div className="font-medium">User Story</div>
									<div className="text-sm text-gray-500">
										Yazım kalitesi
									</div>
								</div>
								<div className="text-lg font-semibold">
									{simulation.userStoryScore || 0}/100
								</div>
							</div>
						</div>

						<div className="grid gap-4">
							<Button variant="outline" asChild className="w-full">
								<Link href="/panel">
									<Home className="mr-2 h-4 w-4" />
									Panele Dön
								</Link>
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
