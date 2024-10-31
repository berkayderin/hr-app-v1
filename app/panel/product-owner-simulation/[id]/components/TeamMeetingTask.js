import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
	RadioGroup,
	RadioGroupItem
} from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

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
		<div className="space-y-8">
			<div className="border-b pb-4">
				<h2 className="text-2xl font-semibold">
					Takım İletişimi Değerlendirmesi
				</h2>
				<p className="text-gray-600 mt-2">
					Aşağıdaki senaryolara en uygun yanıtları seçin.
				</p>
			</div>

			<div className="space-y-8">
				{questions.map((q, index) => (
					<Card key={index} className="border-l-4 border-l-blue-500">
						<CardContent className="p-6">
							<p className="font-medium text-lg mb-4">{q.question}</p>
							<RadioGroup
								onValueChange={(value) =>
									setAnswers({ ...answers, [index]: parseInt(value) })
								}
								value={answers[index]?.toString()}
								className="space-y-3"
							>
								{q.options.map((option, optionIndex) => (
									<div
										key={optionIndex}
										className="flex items-center space-x-3 p-3 rounded hover:bg-gray-50"
									>
										<RadioGroupItem
											value={optionIndex.toString()}
											id={`q${index}-option${optionIndex}`}
										/>
										<Label
											htmlFor={`q${index}-option${optionIndex}`}
											className="flex-1"
										>
											{option}
										</Label>
									</div>
								))}
							</RadioGroup>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="border-t pt-6">
				<Button
					onClick={handleSubmit}
					disabled={Object.keys(answers).length !== questions.length}
					className="w-full py-6 text-lg"
				>
					Yanıtları Gönder
					<ArrowRight className="ml-2" />
				</Button>
			</div>
		</div>
	)
}
