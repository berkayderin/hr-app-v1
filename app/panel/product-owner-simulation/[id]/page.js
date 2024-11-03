// app/panel/product-owner-simulation/[id]/page.js
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import TeamMeetingTask from './components/TeamMeetingTask'
import BacklogPrioritizationTask from './components/BacklogPrioritizationTask'
import UserStoryWritingTask from './components/UserStoryWritingTask'

export default function SimulationPage({ params }) {
	const [simulation, setSimulation] = useState(null)
	const [currentTask, setCurrentTask] = useState(null)
	const router = useRouter()

	useEffect(() => {
		fetchSimulation()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const fetchSimulation = async () => {
		const res = await fetch(
			`/api/product-owner-simulation/${params.id}`
		)
		const data = await res.json()
		setSimulation(data)
		setCurrentTask(data.currentTask)
	}

	const renderTask = () => {
		switch (currentTask) {
			case 'teamMeeting':
				return (
					<TeamMeetingTask
						simulation={simulation}
						onComplete={handleTaskComplete}
					/>
				)
			case 'backlogPrioritization':
				return (
					<BacklogPrioritizationTask
						simulation={simulation}
						onComplete={handleTaskComplete}
					/>
				)
			case 'userStoryWriting':
				return (
					<UserStoryWritingTask
						simulation={simulation}
						onComplete={handleTaskComplete}
					/>
				)
			default:
				return <p>Görev bulunamadı.</p>
		}
	}

	const handleTaskComplete = async (taskData) => {
		try {
			const res = await fetch(
				`/api/product-owner-simulation/${params.id}/complete-task`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ taskData })
				}
			)

			if (!res.ok) {
				const errorData = await res.json()
				throw new Error(
					`HTTP error! status: ${res.status}, message: ${errorData.error}`
				)
			}

			const data = await res.json()

			if (data.completed) {
				router.push(
					`/panel/product-owner-simulation/${params.id}/results`
				)
			} else {
				setSimulation(data)
				setCurrentTask(data.currentTask)
			}
		} catch (error) {
			alert(`Bir hata oluştu: ${error.message}`)
		}
	}

	if (!simulation) return <p>Yükleniyor...</p>

	return (
		<div className="container mx-auto p-4 space-y-6">
			<h1 className="text-2xl font-bold">
				Product Owner Simülasyonu
			</h1>
			{renderTask()}
		</div>
	)
}
