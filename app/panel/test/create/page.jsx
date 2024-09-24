'use client'

import React, { useState } from 'react'

const CreatePage = () => {
	const [response, setResponse] = useState('')
	const [loading, setLoading] = useState(false)
	const [question, setQuestion] = useState('')

	const handleQuestionChange = (event) => {
		setQuestion(event.target.value)
	}

	const fetchMessage = async () => {
		if (!question.trim()) {
			alert('Please enter a question.')
			return
		}

		setLoading(true)
		try {
			const res = await fetch('/api/ask-claude', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ question })
			})

			if (!res.ok) {
				throw new Error('Failed to fetch')
			}

			const data = await res.json()
			setResponse(data.response)
		} catch (error) {
			console.error('Error fetching message:', error)
			setResponse('An error occurred while fetching the message.')
		}
		setLoading(false)
	}

	return (
		<div>
			<h1>CreatePage</h1>
			<textarea
				value={question}
				onChange={handleQuestionChange}
				placeholder="Enter your question"
				rows="4"
				cols="50"
			/>
			<button
				onClick={fetchMessage}
				disabled={loading || !question.trim()}
			>
				{loading ? 'Loading...' : 'Ask Claude'}
			</button>
			{response && (
				<div>
					<h2>Response from Claude:</h2>
					<p>{response}</p>
				</div>
			)}
		</div>
	)
}

export default CreatePage
