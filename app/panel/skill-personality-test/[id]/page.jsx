// app/panel/skill-personality-test/[id]/page.jsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function AdminSkillPersonalityTestDetailPage() {
	const params = useParams()
	const [test, setTest] = useState(null)
	const router = useRouter()

	useEffect(() => {
		const fetchTest = async () => {
			try {
				const response = await fetch(
					`/api/skill-personality-test/${params.id}`
				)
				if (!response.ok) throw new Error('Failed to fetch test')
				const data = await response.json()
				setTest(data.test)
			} catch (error) {
				console.error('Error fetching test:', error)
				toast.error('Failed to load test')
				router.push('/panel/skill-personality-test')
			}
		}
		fetchTest()
	}, [params.id, router])

	if (!test) return <div>Loading...</div>

	return (
		<div className="container mx-auto p-4 space-y-6">
			<h1 className="text-3xl font-bold">{test.title}</h1>

			<Card>
				<CardHeader>
					<CardTitle>Test Overview</CardTitle>
				</CardHeader>
				<CardContent>
					<p>Total Sections: {test.sections.length}</p>
					<p>
						Total Questions:{' '}
						{test.sections.reduce(
							(acc, section) => acc + section.questions.length,
							0
						)}
					</p>
				</CardContent>
			</Card>

			{test.sections.map((section, index) => (
				<Card key={index}>
					<CardHeader>
						<CardTitle>{section.title}</CardTitle>
					</CardHeader>
					<CardContent>
						<p>
							Questions in this section: {section.questions.length}
						</p>
						{section.questions.map((question, qIndex) => (
							<div key={qIndex} className="mt-4">
								<p className="font-semibold">
									{qIndex + 1}. {question.text}
								</p>
								<ul className="list-disc list-inside ml-4">
									{question.options.map((option, oIndex) => (
										<li
											key={oIndex}
											className={
												oIndex === question.correctAnswer
													? 'text-green-600'
													: ''
											}
										>
											{option}{' '}
											{oIndex === question.correctAnswer &&
												'(Correct)'}
										</li>
									))}
								</ul>
							</div>
						))}
					</CardContent>
				</Card>
			))}

			<Card>
				<CardHeader>
					<CardTitle>Test Management</CardTitle>
				</CardHeader>
				<CardContent>
					<Button asChild>
						<Link
							href={`/panel/skill-personality-test/${params.id}/assign`}
						>
							<Users className="mr-2 h-4 w-4" />
							Assign Test to Users
						</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	)
}
