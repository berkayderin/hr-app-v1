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

export default function SkillPersonalityTestResultsPage() {
	const [results, setResults] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const router = useRouter()
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
			<h1 className="text-3xl font-bold mb-6">
				Skill and Personality Test Results
			</h1>

			<Card>
				<CardHeader>
					<CardTitle>Results Overview</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								{session?.user.role === 'admin' && (
									<TableHead>User Email</TableHead>
								)}
								<TableHead>Test Title</TableHead>
								<TableHead>Completed At</TableHead>
								<TableHead>IQ Score</TableHead>
								<TableHead>Practical Score</TableHead>
								<TableHead>Sharp Score</TableHead>
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
										{result.scores?.iqScore ?? 'N/A'}
									</TableCell>
									<TableCell>
										{result.scores?.practicalScore ?? 'N/A'}
									</TableCell>
									<TableCell>
										{result.scores?.sharpScore ?? 'N/A'}
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
