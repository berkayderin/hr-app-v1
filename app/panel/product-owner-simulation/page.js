// app/panel/product-owner-simulation/page.js
'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import TeamMeetingTask from './[id]/components/TeamMeetingTask'
import BacklogPrioritizationTask from './[id]/components/BacklogPrioritizationTask'
import UserStoryWritingTask from './[id]/components/UserStoryWritingTask'

export default function ProductOwnerSimulation({ params }) {
	const [simulation, setSimulation] = useState(null)
	const [currentTask, setCurrentTask] = useState(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const router = useRouter()

	useEffect(() => {
		if (params.id) {
			fetchSimulation(params.id)
		}
	}, [params.id])

	const fetchSimulation = async (id) => {
		setLoading(true)
		setError(null)
		try {
			const res = await fetch(`/api/product-owner-simulation/${id}`)
			if (!res.ok) throw new Error('Failed to fetch simulation')
			const data = await res.json()
			console.log('Fetched simulation data:', data)
			setSimulation(data)
			setCurrentTask(data.currentTask)
		} catch (error) {
			console.error('Error fetching simulation:', error)
			setError('Failed to load simulation. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	const startSimulation = async () => {
		setLoading(true)
		setError(null)
		try {
			const res = await fetch('/api/product-owner-simulation', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ task: 'teamMeeting' })
			})
			if (!res.ok) throw new Error('Failed to start simulation')
			const data = await res.json()
			console.log('Started simulation:', data)
			setSimulation(data)
			setCurrentTask('teamMeeting')
			router.push(`/panel/product-owner-simulation/${data.id}`)
		} catch (error) {
			console.error('Error starting simulation:', error)
			setError('Failed to start simulation. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	const handleTaskComplete = async (taskData) => {
		if (!simulation || !simulation.id) {
			console.error('No active simulation found')
			setError(
				'No active simulation found. Please start a new simulation.'
			)
			return
		}

		setLoading(true)
		setError(null)
		try {
			const res = await fetch(
				`/api/product-owner-simulation/${simulation.id}/complete-task`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ taskData })
				}
			)
			if (!res.ok) throw new Error('Failed to complete task')
			const data = await res.json()
			console.log('Completed task:', data)
			if (data.completed) {
				router.push(
					`/panel/product-owner-simulation/${simulation.id}/results`
				)
			} else {
				setSimulation(data)
				setCurrentTask(data.currentTask)
			}
		} catch (error) {
			console.error('Error completing task:', error)
			setError('Failed to complete task. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	const renderTask = () => {
		if (loading) return <p>Yükleniyor...</p>
		if (error) return <p className="text-red-500">{error}</p>

		if (!simulation) {
			return (
				<div>
					<h2 className="text-xl font-semibold mb-4">
						Product Owner Simülasyonunu Başlat
					</h2>
					<Button onClick={startSimulation} disabled={loading}>
						Simülasyonu Başlat
					</Button>
				</div>
			)
		}

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
				return <p>Beklenmeyen durum: {currentTask}</p>
		}
	}

	return (
		<div className="container mx-auto p-4 space-y-6">
			<h1 className="text-2xl font-bold">
				Product Owner Simülasyonu
			</h1>
			{renderTask()}
		</div>
	)
}
