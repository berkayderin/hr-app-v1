// app/panel/skill-personality-test/results/page.jsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
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
import { toast } from 'sonner'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

export default function SkillPersonalityTestResultsPage() {
	const [results, setResults] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const { data: session } = useSession()

	useEffect(() => {
		const fetchResults = async () => {
			try {
				const response = await fetch(
					'/api/skill-personality-test/results'
				)
				if (!response.ok) throw new Error('Failed to fetch results')
				const data = await response.json()
				setResults(data.results)
				console.log('Fetched test results:', data.results)
			} catch (error) {
				console.error('Error fetching test results:', error)
				toast.error('Failed to load test results')
			} finally {
				setIsLoading(false)
			}
		}
		fetchResults()
	}, [])

	if (isLoading) return <div>Loading...</div>

	return (
		<div className="container mx-auto p-6 space-y-6">
			<Breadcrumb className="mb-4">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/panel">Ana Sayfa</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href="/panel/skill-personality-test">
							Yetenek ve Kişilik Testleri
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
					<CardTitle>Yetenek ve Kişilik Test Sonuçları</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								{session?.user.role === 'admin' && (
									<TableHead>Kullanıcı E-posta</TableHead>
								)}
								<TableHead>Test Adı</TableHead>
								<TableHead>Tamamlanma Zamanı</TableHead>
								<TableHead>IQ Testi</TableHead>
								<TableHead>Pratik Zeka</TableHead>
								<TableHead>Keskin Zeka</TableHead>
								<TableHead>Kişilik Analizi</TableHead>
								<TableHead>Uyumlu Departmanlar</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{results.map((result) => (
								<TableRow key={result.id}>
									{session?.user.role === 'admin' && (
										<TableCell>{result.userEmail}</TableCell>
									)}
									<TableCell>{result.testTitle}</TableCell>
									<TableCell>
										{new Date(result.completedAt).toLocaleString()}
									</TableCell>
									<TableCell>
										{result.scores?.iqScore?.toFixed(2) ?? 'N/A'}
									</TableCell>
									<TableCell>
										{result.scores?.practicalScore?.toFixed(2) ??
											'N/A'}
									</TableCell>
									<TableCell>
										{result.scores?.sharpScore?.toFixed(2) ?? 'N/A'}
									</TableCell>
									<TableCell>
										{result.scores?.personalityScore?.toFixed(2) ??
											'N/A'}
									</TableCell>
									<TableCell>
										{result.scores?.departmentCompatibility?.join(
											', '
										) ?? 'N/A'}
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
