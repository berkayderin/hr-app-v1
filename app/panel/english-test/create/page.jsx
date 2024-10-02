'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent
} from '@/components/ui/card'

export default function Home() {
	const [response, setResponse] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const [question, setQuestion] = useState('')

	const handleQuestionChange = (event) => {
		setQuestion(event.target.value)
	}

	const isButtonDisabled = loading || question.trim() === ''

	const fetchMessage = async () => {
		if (!question.trim()) {
			alert('Please enter a question.')
			return
		}

		setLoading(true)
		setError('')
		setResponse('')
		try {
			const res = await fetch('/api/ask-claude', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ question })
			})

			if (!res.ok) {
				const errorData = await res.json()
				throw new Error(errorData.details || 'Failed to fetch')
			}

			const data = await res.json()
			setResponse(data.response)
		} catch (error) {
			console.error('Error fetching message:', error)
			setError(`An error occurred: ${error.message}`)
		}
		setLoading(false)
	}

	return (
		<div className="container mx-auto p-4 max-w-2xl">
			<Card>
				<CardHeader>
					<CardTitle>Test Oluştur</CardTitle>
				</CardHeader>
				<CardContent>
					<Textarea
						value={question}
						onChange={handleQuestionChange}
						placeholder="Sorunuzu yazın..."
						className="mb-4"
						rows={4}
					/>
					<Button
						onClick={fetchMessage}
						disabled={isButtonDisabled}
						className="w-full"
					>
						{loading ? 'Yükleniyor...' : 'Gönder'}
					</Button>
					{error && (
						<div className="mt-4 text-red-500">
							<h2 className="text-xl font-semibold mb-2">Hata:</h2>
							<p>{error}</p>
						</div>
					)}
					{response && (
						<div className="mt-4">
							<h2 className="text-xl font-semibold mb-2">Cevap:</h2>
							<p className="whitespace-pre-wrap">{response}</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
