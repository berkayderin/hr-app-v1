import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

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
		<div className="space-y-8">
			<div className="border-b pb-4">
				<h2 className="text-2xl font-semibold">
					Kullanıcı Hikayesi Yazma
				</h2>
				<p className="text-gray-600 mt-2">
					Verilen senaryoya uygun bir kullanıcı hikayesi oluşturun.
				</p>
			</div>

			<Card className="border-l-4 border-l-blue-500">
				<CardContent className="p-6">
					<h3 className="font-semibold text-lg mb-4">Senaryo</h3>
					<div className="space-y-3 text-gray-700">
						<p>{scenario.scenario}</p>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
							<div className="bg-gray-50 p-3 rounded">
								<div className="font-medium">Kullanıcı Rolü</div>
								<div className="text-sm mt-1">
									{scenario.userRole}
								</div>
							</div>
							<div className="bg-gray-50 p-3 rounded">
								<div className="font-medium">İstenen Özellik</div>
								<div className="text-sm mt-1">{scenario.feature}</div>
							</div>
							<div className="bg-gray-50 p-3 rounded">
								<div className="font-medium">Beklenen Fayda</div>
								<div className="text-sm mt-1">{scenario.benefit}</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="space-y-6">
				<div className="grid gap-6">
					<div>
						<label className="block text-sm font-medium mb-2">
							As a
						</label>
						<Input
							value={userStory.asA}
							onChange={(e) =>
								setUserStory({ ...userStory, asA: e.target.value })
							}
							placeholder={scenario.userRole}
							className="h-12"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-2">
							I want to
						</label>
						<Input
							value={userStory.iWantTo}
							onChange={(e) =>
								setUserStory({
									...userStory,
									iWantTo: e.target.value
								})
							}
							placeholder={scenario.feature}
							className="h-12"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-2">
							So that
						</label>
						<Input
							value={userStory.soThat}
							onChange={(e) =>
								setUserStory({ ...userStory, soThat: e.target.value })
							}
							placeholder={scenario.benefit}
							className="h-12"
						/>
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium mb-4">
						Kabul Kriterleri
					</label>
					<div className="space-y-3">
						{userStory.acceptanceCriteria.map((criteria, index) => (
							<div key={index} className="flex items-start gap-3">
								<div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
									{index + 1}
								</div>
								<Textarea
									value={criteria}
									onChange={(e) =>
										handleAcceptanceCriteriaChange(
											index,
											e.target.value
										)
									}
									placeholder={`Kabul kriteri ${index + 1}`}
									className="flex-1"
								/>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="border-t pt-6">
				<Button
					onClick={handleSubmit}
					disabled={
						!userStory.asA || !userStory.iWantTo || !userStory.soThat
					}
					className="w-full py-6 text-lg"
				>
					Kullanıcı Hikayesini Gönder
					<ArrowRight className="ml-2" />
				</Button>
			</div>
		</div>
	)
}
