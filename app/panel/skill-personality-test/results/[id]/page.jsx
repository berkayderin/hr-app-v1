// app/panel/skill-personality-test/results/[id]/page.jsx
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

export default function SkillPersonalityTestResultsPage() {
	const params = useParams()
	const [results, setResults] = useState(null)

	useEffect(() => {
		const fetchResults = async () => {
			try {
				const response = await fetch(
					`/api/skill-personality-test/results/${params.id}`
				)
				if (!response.ok) throw new Error('Failed to fetch results')
				const data = await response.json()
				setResults(data)
			} catch (error) {
				toast.error('Failed to load test results')
			}
		}
		fetchResults()
	}, [params.id])

	if (!results) return null

	return (
		<div className="container mx-auto p-6 max-w-2xl">
			<h1 className="text-3xl font-bold mb-8 text-center">
				Test Results
			</h1>
			<Card className="mb-6">
				<CardHeader>
					<CardTitle>Overall Scores</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div>
							<div className="flex justify-between mb-1">
								<span>IQ Score</span>
								<span>{results.iqScore}</span>
							</div>
							<Progress value={results.iqScore} />
						</div>
						<div>
							<div className="flex justify-between mb-1">
								<span>Practical Intelligence Score</span>
								<span>{results.practicalScore}</span>
							</div>
							<Progress value={results.practicalScore} />
						</div>
						<div>
							<div className="flex justify-between mb-1">
								<span>Sharp Intelligence Score</span>
								<span>{results.sharpScore}</span>
							</div>
							<Progress value={results.sharpScore} />
						</div>
					</div>
				</CardContent>
			</Card>
			<Card className="mb-6">
				<CardHeader>
					<CardTitle>Personality Profile</CardTitle>
				</CardHeader>
				<CardContent>
					<p>{results.personalityProfile}</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Department Compatibility Analysis</CardTitle>
				</CardHeader>
				<CardContent>
					<ul className="list-disc pl-5">
						{results.departmentCompatibility.map((dept, index) => (
							<li key={index}>{dept}</li>
						))}
					</ul>
				</CardContent>
			</Card>
		</div>
	)
}
