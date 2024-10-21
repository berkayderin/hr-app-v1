// app/panel/product-owner-simulation/[id]/components/TeamMeetingTask.js
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
	RadioGroup,
	RadioGroupItem
} from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

const questions = [
	{
		question:
			'Sprint planlama toplantısında, takım üyelerinden biri önceki sprintte tamamlanamayan bir görevi bu sprinte aktarmak istiyor. Ne yaparsınız?',
		options: [
			'Görevi olduğu gibi bu sprinte aktarırım.',
			"Görevi reddeder ve backlog'a geri koyarım.",
			'Görevi analiz eder, gerekirse böler ve önceliklendiririm.',
			'Takım üyesini eleştirir ve daha sıkı çalışmasını söylerim.'
		]
	}
	// Daha fazla soru ekleyin
]

export default function TeamMeetingTask({ onComplete }) {
	const [answers, setAnswers] = useState({})

	const handleSubmit = () => {
		onComplete({ teamMeeting: answers })
	}

	return (
		<div className="space-y-6">
			<h2 className="text-xl font-semibold">Takım Toplantısı</h2>
			{questions.map((q, index) => (
				<div key={index} className="space-y-4">
					<p className="font-medium">{q.question}</p>
					<RadioGroup
						onValueChange={(value) =>
							setAnswers({ ...answers, [index]: value })
						}
						value={answers[index]}
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
			<Button onClick={handleSubmit}>Tamamla</Button>
		</div>
	)
}
