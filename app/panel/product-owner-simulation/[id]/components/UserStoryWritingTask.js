import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

export default function UserStoryWritingTask({
	simulation,
	onComplete
}) {
	const [scenario, setScenario] = useState(null)
	const [userStory, setUserStory] = useState({
		asA: '',
		iWantTo: '',
		soThat: '',
		acceptanceCriteria: ['', '', '', '', '']
	})
	const [error, setError] = useState(null)

	useEffect(() => {
		if (simulation && simulation.userStoryWriting) {
			setScenario(simulation.userStoryWriting)
		} else {
			setError(
				'User story writing scenario not found in the simulation.'
			)
		}
	}, [simulation])

	const handleSubmit = () => {
		onComplete({ userStoryWriting: userStory })
	}

	const handleAcceptanceCriteriaChange = (index, value) => {
		const newAcceptanceCriteria = [...userStory.acceptanceCriteria]
		newAcceptanceCriteria[index] = value
		setUserStory({
			...userStory,
			acceptanceCriteria: newAcceptanceCriteria
		})
	}

	if (error) {
		return <p className="text-red-500">{error}</p>
	}

	if (!scenario) {
		return <p>Yükleniyor...</p>
	}

	return (
		<div className="space-y-6">
			<h2 className="text-xl font-semibold">
				Kullanıcı Hikayesi Yazma
			</h2>
			<div className="bg-gray-100 p-4 rounded">
				<h3 className="font-medium">Senaryo:</h3>
				<p>{scenario.scenario}</p>
				<p>
					<strong>Kullanıcı Rolü:</strong> {scenario.userRole}
				</p>
				<p>
					<strong>İstenen Özellik:</strong> {scenario.feature}
				</p>
				<p>
					<strong>Beklenen Fayda:</strong> {scenario.benefit}
				</p>
			</div>
			<div className="space-y-4">
				<div>
					<label className="block mb-2">As a</label>
					<Input
						value={userStory.asA}
						onChange={(e) =>
							setUserStory({ ...userStory, asA: e.target.value })
						}
						placeholder={scenario.userRole}
					/>
				</div>
				<div>
					<label className="block mb-2">I want to</label>
					<Input
						value={userStory.iWantTo}
						onChange={(e) =>
							setUserStory({ ...userStory, iWantTo: e.target.value })
						}
						placeholder={scenario.feature}
					/>
				</div>
				<div>
					<label className="block mb-2">So that</label>
					<Input
						value={userStory.soThat}
						onChange={(e) =>
							setUserStory({ ...userStory, soThat: e.target.value })
						}
						placeholder={scenario.benefit}
					/>
				</div>
				<div>
					<label className="block mb-2">Kabul Kriterleri</label>
					{userStory.acceptanceCriteria.map((criteria, index) => (
						<Textarea
							key={index}
							value={criteria}
							onChange={(e) =>
								handleAcceptanceCriteriaChange(index, e.target.value)
							}
							placeholder={`Kabul kriteri ${index + 1}`}
							className="mb-2"
						/>
					))}
				</div>
			</div>
			<Button
				onClick={handleSubmit}
				disabled={
					!userStory.asA || !userStory.iWantTo || !userStory.soThat
				}
			>
				Tamamla
			</Button>
		</div>
	)
}
