'use client'
import React, { useState, useEffect } from 'react'
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardDescription
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import {
	Search,
	SortAsc,
	SortDesc,
	CheckCircle2,
	Clock,
	Trophy,
	Users,
	Brain,
	ListChecks,
	Info,
	ArrowUpRight
} from 'lucide-react'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@/components/ui/tooltip'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

export default function SimulationsPage() {
	const [simulations, setSimulations] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [searchTerm, setSearchTerm] = useState('')
	const [sortConfig, setSortConfig] = useState({
		key: 'completedAt',
		direction: 'desc'
	})

	useEffect(() => {
		fetchSimulations()
	}, [])

	const fetchSimulations = async () => {
		try {
			const response = await fetch('/api/simulations')
			if (!response.ok) throw new Error('Failed to fetch simulations')
			const data = await response.json()
			setSimulations(data)
		} catch (error) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}

	const handleSort = (key) => {
		setSortConfig({
			key,
			direction:
				sortConfig.key === key && sortConfig.direction === 'asc'
					? 'desc'
					: 'asc'
		})
	}

	const filteredAndSortedSimulations = [...simulations]
		.filter(
			(simulation) =>
				simulation.candidateEmail
					.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				simulation.type
					.toLowerCase()
					.includes(searchTerm.toLowerCase())
		)
		.sort((a, b) => {
			const direction = sortConfig.direction === 'asc' ? 1 : -1
			switch (sortConfig.key) {
				case 'score':
					return (a.score - b.score) * direction
				case 'completedAt':
					return (
						(new Date(a.completedAt) - new Date(b.completedAt)) *
						direction
					)
				default:
					return 0
			}
		})

	const getPerformanceColor = (score) => {
		if (score >= 90) return 'text-green-600'
		if (score >= 75) return 'text-blue-600'
		if (score >= 60) return 'text-yellow-600'
		return 'text-red-600'
	}

	const getStatusColor = (status) => {
		switch (status) {
			case 'Tamamlandı':
				return 'text-green-600'
			case 'Devam Ediyor':
				return 'text-orange-600'
			default:
				return 'text-gray-600'
		}
	}

	if (loading)
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
			</div>
		)

	if (error)
		return (
			<div className="flex items-center justify-center h-screen text-red-600">
				Hata: {error}
			</div>
		)

	const completedSimulations = simulations.filter(
		(s) => s.status === 'Tamamlandı'
	)
	const averageScore = Math.round(
		completedSimulations.reduce(
			(acc, sim) => acc + (sim.score || 0),
			0
		) / (completedSimulations.length || 1)
	)

	return (
		<div className="container mx-auto p-6 space-y-6">
			<Card>
				<CardHeader>
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
						<div>
							<CardTitle className="text-2xl font-bold">
								Simülasyon Sonuçları
							</CardTitle>
							<CardDescription>
								Tüm adayların simülasyon performansları
							</CardDescription>
						</div>
						<div className="w-full md:w-72">
							<div className="relative">
								<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Aday veya simülasyon tipi ara..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-8"
								/>
							</div>
						</div>
					</div>
				</CardHeader>

				<CardContent>
					{/* İstatistik Kartları */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
						<Card>
							<CardContent className="pt-6">
								<div className="flex justify-between space-x-4">
									<div>
										<p className="text-sm font-medium text-gray-500">
											Toplam Simülasyon
										</p>
										<p className="text-2xl font-bold">
											{simulations.length}
										</p>
									</div>
									<div className="bg-blue-100 p-2 rounded-full h-10 w-10">
										<Brain className="h-6 w-6 text-blue-600" />
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="pt-6">
								<div className="flex justify-between space-x-4">
									<div>
										<p className="text-sm font-medium text-gray-500">
											Tamamlanan
										</p>
										<p className="text-2xl font-bold">
											{completedSimulations.length}
										</p>
									</div>
									<div className="bg-green-100 p-2 rounded-full h-10 w-10">
										<CheckCircle2 className="h-6 w-6 text-green-600" />
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="pt-6">
								<div className="flex justify-between space-x-4">
									<div>
										<p className="text-sm font-medium text-gray-500">
											Devam Eden
										</p>
										<p className="text-2xl font-bold">
											{
												simulations.filter(
													(s) => s.status === 'Devam Ediyor'
												).length
											}
										</p>
									</div>
									<div className="bg-orange-100 p-2 rounded-full h-10 w-10">
										<Clock className="h-6 w-6 text-orange-600" />
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="pt-6">
								<div className="flex justify-between space-x-4">
									<div>
										<p className="text-sm font-medium text-gray-500">
											Ortalama Puan
										</p>
										<p className="text-2xl font-bold">
											{averageScore}
										</p>
									</div>
									<div className="bg-yellow-100 p-2 rounded-full h-10 w-10">
										<Trophy className="h-6 w-6 text-yellow-600" />
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Simülasyon Tablosu */}
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Aday</TableHead>
									<TableHead>Simülasyon Tipi</TableHead>
									<TableHead>
										<button
											onClick={() => handleSort('completedAt')}
											className="flex items-center space-x-1"
										>
											<span>Tamamlanma</span>
											{sortConfig.key === 'completedAt' &&
												(sortConfig.direction === 'asc' ? (
													<SortAsc className="h-4 w-4" />
												) : (
													<SortDesc className="h-4 w-4" />
												))}
										</button>
									</TableHead>
									<TableHead>
										<button
											onClick={() => handleSort('score')}
											className="flex items-center space-x-1"
										>
											<span>Toplam Puan</span>
											{sortConfig.key === 'score' &&
												(sortConfig.direction === 'asc' ? (
													<SortAsc className="h-4 w-4" />
												) : (
													<SortDesc className="h-4 w-4" />
												))}
										</button>
									</TableHead>
									<TableHead>Görev Puanları</TableHead>
									<TableHead>Durum</TableHead>
									<TableHead>Detaylar</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredAndSortedSimulations.map((simulation) => (
									<TableRow key={simulation.id}>
										<TableCell className="font-medium">
											{simulation.candidateEmail}
										</TableCell>
										<TableCell>{simulation.type}</TableCell>
										<TableCell>
											{simulation.completedAt
												? format(
														new Date(simulation.completedAt),
														'dd MMM yyyy HH:mm',
														{ locale: tr }
												  )
												: '-'}
										</TableCell>
										<TableCell>
											<div className="flex items-center space-x-2">
												<Trophy
													className={`h-4 w-4 ${getPerformanceColor(
														simulation.score
													)}`}
												/>
												<span>{simulation.score || 0}</span>
											</div>
										</TableCell>
										<TableCell>
											<div className="flex items-center space-x-3">
												<TooltipProvider>
													<Tooltip>
														<TooltipTrigger>
															<div className="flex items-center space-x-1">
																<Users className="h-4 w-4 text-blue-500" />
																<span>
																	{simulation.taskScores.teamMeeting}%
																</span>
															</div>
														</TooltipTrigger>
														<TooltipContent>
															<p>Takım İletişimi Puanı</p>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>

												<TooltipProvider>
													<Tooltip>
														<TooltipTrigger>
															<div className="flex items-center space-x-1">
																<ListChecks className="h-4 w-4 text-green-500" />
																<span>
																	{
																		simulation.taskScores
																			.backlogPrioritization
																	}
																	%
																</span>
															</div>
														</TooltipTrigger>
														<TooltipContent>
															<p>Backlog Yönetimi Puanı</p>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>

												<TooltipProvider>
													<Tooltip>
														<TooltipTrigger>
															<div className="flex items-center space-x-1">
																<Brain className="h-4 w-4 text-purple-500" />
																<span>
																	{simulation.taskScores.userStory}%
																</span>
															</div>
														</TooltipTrigger>
														<TooltipContent>
															<p>User Story Puanı</p>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											</div>
										</TableCell>
										<TableCell>
											<div
												className={`flex items-center space-x-2 ${getStatusColor(
													simulation.status
												)}`}
											>
												{simulation.status === 'Tamamlandı' ? (
													<CheckCircle2 className="h-4 w-4" />
												) : (
													<Clock className="h-4 w-4" />
												)}
												<span>{simulation.status}</span>
											</div>
										</TableCell>
										<TableCell>
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger>
														<Info className="h-4 w-4 text-blue-500" />
													</TooltipTrigger>
													<TooltipContent className="max-w-sm">
														<div className="space-y-2">
															<p className="font-medium">
																Detaylı Performans:
															</p>
															<ul className="text-sm space-y-1">
																<li>
																	• Takım Toplantısı:{' '}
																	{simulation.details.teamMeeting
																		?.questionsAnswered || 0}{' '}
																	soru yanıtlandı
																</li>
																<li>
																	• Backlog: %
																	{simulation.details
																		.backlogPrioritization
																		?.priorityAlignment || 0}{' '}
																	öncelik uyumu
																</li>
																<li>
																	• User Story:{' '}
																	{simulation.details.userStory
																		?.acceptanceCriteria || 0}{' '}
																	kabul kriteri
																</li>
															</ul>
														</div>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>

					{/* Performans Dağılımı */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<Card className="mt-6">
							<CardHeader>
								<CardTitle className="text-lg">
									Performans Dağılımı
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div>
										<div className="flex justify-between text-sm mb-1">
											<div className="flex items-center space-x-2">
												<div className="w-3 h-3 rounded-full bg-green-500" />
												<span>Mükemmel (90-100)</span>
											</div>
											<span className="font-medium">
												{
													simulations.filter((s) => s.score >= 90)
														.length
												}{' '}
												aday
											</span>
										</div>
										<div className="h-2 bg-gray-100 rounded-full overflow-hidden">
											<div
												className="h-full bg-green-500 rounded-full transition-all duration-500"
												style={{
													width: `${
														(simulations.filter((s) => s.score >= 90)
															.length /
															completedSimulations.length) *
														100
													}%`
												}}
											/>
										</div>
									</div>

									<div>
										<div className="flex justify-between text-sm mb-1">
											<div className="flex items-center space-x-2">
												<div className="w-3 h-3 rounded-full bg-blue-500" />
												<span>İyi (75-89)</span>
											</div>
											<span className="font-medium">
												{
													simulations.filter(
														(s) => s.score >= 75 && s.score < 90
													).length
												}{' '}
												aday
											</span>
										</div>
										<div className="h-2 bg-gray-100 rounded-full overflow-hidden">
											<div
												className="h-full bg-blue-500 rounded-full transition-all duration-500"
												style={{
													width: `${
														(simulations.filter(
															(s) => s.score >= 75 && s.score < 90
														).length /
															completedSimulations.length) *
														100
													}%`
												}}
											/>
										</div>
									</div>

									<div>
										<div className="flex justify-between text-sm mb-1">
											<div className="flex items-center space-x-2">
												<div className="w-3 h-3 rounded-full bg-yellow-500" />
												<span>Orta (60-74)</span>
											</div>
											<span className="font-medium">
												{
													simulations.filter(
														(s) => s.score >= 60 && s.score < 75
													).length
												}{' '}
												aday
											</span>
										</div>
										<div className="h-2 bg-gray-100 rounded-full overflow-hidden">
											<div
												className="h-full bg-yellow-500 rounded-full transition-all duration-500"
												style={{
													width: `${
														(simulations.filter(
															(s) => s.score >= 60 && s.score < 75
														).length /
															completedSimulations.length) *
														100
													}%`
												}}
											/>
										</div>
									</div>

									<div>
										<div className="flex justify-between text-sm mb-1">
											<div className="flex items-center space-x-2">
												<div className="w-3 h-3 rounded-full bg-red-500" />
												<span>Geliştirilebilir (0-59)</span>
											</div>
											<span className="font-medium">
												{
													simulations.filter((s) => s.score < 60)
														.length
												}{' '}
												aday
											</span>
										</div>
										<div className="h-2 bg-gray-100 rounded-full overflow-hidden">
											<div
												className="h-full bg-red-500 rounded-full transition-all duration-500"
												style={{
													width: `${
														(simulations.filter((s) => s.score < 60)
															.length /
															completedSimulations.length) *
														100
													}%`
												}}
											/>
										</div>
									</div>
								</div>

								<div className="mt-4 pt-4 border-t">
									<div className="flex justify-between items-center text-sm text-gray-500">
										<span>Toplam Tamamlanan Simülasyon:</span>
										<span className="font-medium">
											{completedSimulations.length} aday
										</span>
									</div>
									<div className="flex justify-between items-center text-sm text-gray-500 mt-1">
										<span>Ortalama Başarı Puanı:</span>
										<span className="font-medium">
											{averageScore}
										</span>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Simülasyon tiplerine göre dağılım */}
						<Card className="mt-6">
							<CardHeader>
								<CardTitle className="text-lg">
									Simülasyon Tiplerine Göre Dağılım
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{Object.entries(
										simulations.reduce((acc, sim) => {
											acc[sim.type] = (acc[sim.type] || 0) + 1
											return acc
										}, {})
									).map(([type, count]) => (
										<div key={type}>
											<div className="flex justify-between text-sm mb-1">
												<span>{type}</span>
												<span className="font-medium">
													{count} simülasyon
												</span>
											</div>
											<div className="h-2 bg-gray-100 rounded-full overflow-hidden">
												<div
													className="h-full bg-primary rounded-full transition-all duration-500"
													style={{
														width: `${
															(count / simulations.length) * 100
														}%`
													}}
												/>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
