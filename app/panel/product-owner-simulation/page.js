// app/panel/product-owner-simulation/page.js
'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import TeamMeetingTask from './[id]/components/TeamMeetingTask'
import BacklogPrioritizationTask from './[id]/components/BacklogPrioritizationTask'
import UserStoryWritingTask from './[id]/components/UserStoryWritingTask'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, ArrowRight, Clock } from 'lucide-react'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export default function ProductOwnerSimulation({ params }) {
	const [simulation, setSimulation] = useState(null)
	const [currentTask, setCurrentTask] = useState(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const [timeLeft, setTimeLeft] = useState(3600)
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

	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60)
		const secs = seconds % 60
		return `${mins}:${secs.toString().padStart(2, '0')}`
	}

	const renderTask = () => {
		if (loading)
			return (
				<div className="flex justify-center">
					<div className="animate-pulse text-blue-500">
						Yükleniyor...
					</div>
				</div>
			)
		if (error)
			return (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)

		if (!simulation) {
			return (
				<Card className="max-w-2xl mx-auto">
					<CardHeader className="text-center pb-8 border-b">
						<CardTitle className="text-3xl">
							Product Owner Pozisyonu
						</CardTitle>
						<p className="text-gray-500 mt-2">
							Teknik Mülakat Simülasyonu
						</p>
					</CardHeader>
					<CardContent className="pt-8">
						<div className="space-y-6">
							<div className="bg-blue-50 p-4 rounded-lg">
								<h3 className="font-medium text-blue-900 mb-2">
									Mülakat Hakkında
								</h3>
								<ul className="text-sm text-blue-800 space-y-2">
									<li>• Toplam süre: 60 dakika</li>
									<li>• 3 farklı değerlendirme görevi</li>
									<li>• Her görev için ayrı süre takibi</li>
									<li>• Otomatik değerlendirme sistemi</li>
								</ul>
							</div>
							<Button
								onClick={startSimulation}
								disabled={loading}
								className="w-full py-6 text-lg"
							>
								Mülakata Başla
								<ArrowRight className="ml-2" />
							</Button>
						</div>
					</CardContent>
				</Card>
			)
		}

		return (
			<div className="space-y-8">
				<div className="bg-white p-6 rounded-lg shadow-lg">
					<div className="flex justify-between items-center mb-4">
						<div>
							<h2 className="text-xl font-bold">Mevcut Görev</h2>
							<p className="text-gray-500">
								{currentTask === 'teamMeeting' &&
									'Takım İletişimi Değerlendirmesi'}
								{currentTask === 'backlogPrioritization' &&
									'Backlog Önceliklendirme'}
								{currentTask === 'userStoryWriting' &&
									'Kullanıcı Hikayesi Yazma'}
							</p>
						</div>
						<div className="flex items-center bg-blue-50 px-4 py-2 rounded-full">
							<Clock className="h-5 w-5 text-blue-500 mr-2" />
							<span className="font-mono text-lg">
								{formatTime(timeLeft)}
							</span>
						</div>
					</div>
					<Progress
						value={
							currentTask === 'teamMeeting'
								? 33
								: currentTask === 'backlogPrioritization'
								? 66
								: currentTask === 'userStoryWriting'
								? 100
								: 0
						}
						className="h-2"
					/>
				</div>

				<div className="bg-white p-8 rounded-lg shadow-lg">
					{currentTask === 'teamMeeting' && (
						<TeamMeetingTask
							simulation={simulation}
							onComplete={handleTaskComplete}
						/>
					)}
					{currentTask === 'backlogPrioritization' && (
						<BacklogPrioritizationTask
							simulation={simulation}
							onComplete={handleTaskComplete}
						/>
					)}
					{currentTask === 'userStoryWriting' && (
						<UserStoryWritingTask
							simulation={simulation}
							onComplete={handleTaskComplete}
						/>
					)}
				</div>
			</div>
		)
	}

	return (
		<div className="container mx-auto p-4 min-h-screen bg-gray-50">
			{renderTask()}
		</div>
	)
}
