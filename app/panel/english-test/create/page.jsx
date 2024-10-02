// app/panel/english-test/create/page.jsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export default function CreateEnglishTestPage() {
	const [title, setTitle] = useState('')
	const [level, setLevel] = useState('')
	const [prompt, setPrompt] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const router = useRouter()

	const handleSubmit = async (e) => {
		e.preventDefault()
		setIsLoading(true)
		setError('')

		try {
			const response = await fetch('/api/english-test/create', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title, level, prompt })
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || 'Failed to create test')
			}

			router.push('/panel/english-test')
		} catch (error) {
			console.error('Error creating test:', error)
			setError(error.message || 'An unexpected error occurred')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-3xl font-bold mb-8">Create English Test</h1>
			{error && <p className="text-red-500 mb-4">{error}</p>}
			<form onSubmit={handleSubmit} className="space-y-4">
				<Input
					placeholder="Test Title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					required
				/>
				<Select value={level} onValueChange={setLevel} required>
					<SelectTrigger>
						<SelectValue placeholder="Select Level" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="B1">B1</SelectItem>
						<SelectItem value="B2">B2</SelectItem>
					</SelectContent>
				</Select>
				<Textarea
					placeholder="Enter prompt for AI to generate questions"
					value={prompt}
					onChange={(e) => setPrompt(e.target.value)}
					required
				/>
				<Button type="submit" disabled={isLoading}>
					{isLoading ? 'Creating...' : 'Create Test'}
				</Button>
			</form>
		</div>
	)
}
