// app/panel/skill-personality-test/create/page.jsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter
} from '@/components/ui/card'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'

export default function CreateSkillPersonalityTestPage() {
	const [title, setTitle] = useState('')
	const [prompt, setPrompt] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()

	const handleSubmit = async (e) => {
		e.preventDefault()
		setIsLoading(true)
		try {
			const response = await fetch(
				'/api/skill-personality-test/create',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ title, prompt })
				}
			)
			if (!response.ok) throw new Error('Failed to create test')
			toast.success('Test created successfully')
			router.push('/panel/skill-personality-test')
		} catch (error) {
			toast.error('Failed to create test')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-3xl font-bold mb-6">
				Create Skill and Personality Test
			</h1>
			<form onSubmit={handleSubmit}>
				<Card>
					<CardHeader>
						<CardTitle>Test Details</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<label
								htmlFor="title"
								className="block text-sm font-medium text-gray-700"
							>
								Test Title
							</label>
							<Input
								id="title"
								placeholder="Enter test title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
							/>
						</div>
						<div>
							<label
								htmlFor="prompt"
								className="block text-sm font-medium text-gray-700"
							>
								AI Prompt
							</label>
							<Textarea
								id="prompt"
								placeholder="Enter additional instructions for AI to generate the test"
								value={prompt}
								onChange={(e) => setPrompt(e.target.value)}
								rows={4}
								required
							/>
						</div>
					</CardContent>
					<CardFooter>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Creating Test...
								</>
							) : (
								<>
									<Save className="mr-2 h-4 w-4" /> Create Test
								</>
							)}
						</Button>
					</CardFooter>
				</Card>
			</form>
		</div>
	)
}
