import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
	RadioGroup,
	RadioGroupItem
} from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

export default function TeamMeetingTask({ simulation, onComplete }) {
	const [questions, setQuestions] = useState([])
	const [answers, setAnswers] = useState({})
	const [error, setError] = useState(null)

	useEffect(() => {
		if (simulation && simulation.teamMeeting) {
			if (Array.isArray(simulation.teamMeeting)) {
				setQuestions(simulation.teamMeeting)
			} else {
				setError('Team meeting data is not in the expected format.')
			}
		} else {
			setError('Team meeting questions not found in the simulation.')
		}
	}, [simulation])

	const handleSubmit = () => {
		onComplete({ teamMeeting: answers })
	}

	if (error) {
		return <p className="text-red-500">{error}</p>
	}

	if (questions.length === 0) {
		return <p>Yükleniyor...</p>
	}

	return (
		<div className="space-y-6">
			<h2 className="text-xl font-semibold">Takım Toplantısı</h2>
			{questions.map((q, index) => (
				<div key={index} className="space-y-4">
					<p className="font-medium">{q.question}</p>
					<RadioGroup
						onValueChange={(value) =>
							setAnswers({ ...answers, [index]: parseInt(value) })
						}
						value={answers[index]?.toString()}
					>
						{q.options.map((option, optionIndex) => (
							<div
								key={optionIndex}
								className="flex items-center space-x-2"
							>
								<RadioGroupItem
									value={optionIndex.toString()}
									id={`q${index}-option${optionIndex}`}
								/>
								<Label htmlFor={`q${index}-option${optionIndex}`}>
									{option}
								</Label>
							</div>
						))}
					</RadioGroup>
				</div>
			))}
			<Button
				onClick={handleSubmit}
				disabled={Object.keys(answers).length !== questions.length}
			>
				Tamamla
			</Button>
		</div>
	)
}
