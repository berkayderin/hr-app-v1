import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
	DragDropContext,
	Droppable,
	Draggable
} from '@hello-pangea/dnd'
import { AlertCircle, ArrowRight, GripVertical } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function BacklogPrioritizationTask({
	simulation,
	onComplete
}) {
	const [backlog, setBacklog] = useState([])
	const [error, setError] = useState(null)
	const [isDragging, setIsDragging] = useState(false)

	useEffect(() => {
		if (simulation && simulation.backlogPrioritization) {
			const formattedBacklog = simulation.backlogPrioritization.map(
				(item, index) => ({
					...item,
					id: item.id ? String(item.id) : `item-${index}`
				})
			)
			setBacklog(formattedBacklog)
		} else {
			setError('Backlog data not found in the simulation.')
		}
	}, [simulation])

	useEffect(() => {
		if (simulation && simulation.backlogPrioritization) {
			const formattedBacklog = simulation.backlogPrioritization.map(
				(item, index) => ({
					...item,
					id: item.id ? String(item.id) : `item-${index}`
				})
			)
			setBacklog(formattedBacklog)
		} else {
			setError('Backlog data not found in the simulation.')
		}
	}, [simulation])

	const onDragStart = () => {
		setIsDragging(true)
	}

	const onDragEnd = (result) => {
		if (!result.destination) return
		const items = Array.from(backlog)
		const [reorderedItem] = items.splice(result.source.index, 1)
		items.splice(result.destination.index, 0, reorderedItem)
		setBacklog(items)
	}

	const handleSubmit = () => {
		onComplete({ backlogPrioritization: backlog })
	}

	if (error) {
		return (
			<Alert variant="destructive">
				<AlertCircle className="h-4 w-4" />
				<AlertDescription>{error}</AlertDescription>
			</Alert>
		)
	}

	if (backlog.length === 0) {
		return (
			<div className="flex justify-center">
				<div className="animate-pulse text-blue-500">
					Yükleniyor...
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-8">
			<div className="border-b pb-4">
				<h2 className="text-2xl font-semibold">
					Backlog Önceliklendirme
				</h2>
				<p className="text-gray-600 mt-2">
					Öğeleri öncelik sırasına göre sürükleyip bırakarak
					düzenleyin.
				</p>
			</div>

			{/* Yönergeler */}
			<Card className="bg-blue-50 border-blue-200">
				<CardContent className="p-4">
					<div className="flex items-start space-x-3">
						<div className="p-2 bg-blue-100 rounded-lg">
							<GripVertical className="h-5 w-5 text-blue-600" />
						</div>
						<div>
							<h3 className="font-medium text-blue-900">
								Sürükle & Bırak Özelliği
							</h3>
							<p className="text-sm text-blue-700 mt-1">
								• Her öğeyi tutup sürükleyerek öncelik sırasını
								değiştirebilirsiniz
								<br />
								• En önemli öğeleri listenin üst kısmına taşıyın
								<br />• Sürüklerken mavi çerçeve öğenin yeni konumunu
								gösterir
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<DragDropContext
				onDragEnd={onDragEnd}
				onDragStart={onDragStart}
			>
				<Droppable droppableId="backlog">
					{(provided, snapshot) => (
						<ul
							{...provided.droppableProps}
							ref={provided.innerRef}
							className={`space-y-3 ${
								snapshot.isDraggingOver
									? 'bg-blue-50 p-4 rounded-lg'
									: ''
							}`}
						>
							{backlog.map((item, index) => (
								<Draggable
									key={item.id}
									draggableId={item.id}
									index={index}
								>
									{(provided, snapshot) => (
										<li
											ref={provided.innerRef}
											{...provided.draggableProps}
											className={`p-4 bg-white rounded-lg transition-all duration-200 ${
												snapshot.isDragging
													? 'shadow-lg ring-2 ring-blue-400'
													: 'shadow-sm border border-gray-200 hover:shadow-md'
											}`}
										>
											<div className="flex items-center gap-4">
												{/* Sürükleme Tutacağı */}
												<div
													{...provided.dragHandleProps}
													className="flex-shrink-0 p-2 rounded-md hover:bg-gray-100 cursor-grab active:cursor-grabbing"
												>
													<GripVertical className="h-5 w-5 text-gray-400" />
												</div>

												<div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
													<span className="text-gray-600 font-medium">
														{index + 1}
													</span>
												</div>

												<div className="flex-1">
													<div className="font-medium text-lg">
														{item.title}
													</div>
													<div className="text-gray-500 mt-1">
														{item.description}
													</div>
													<div className="mt-2 space-x-2">
														<span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
															{item.storyPoints} Story Points
														</span>
														<span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
															Öncelik #{index + 1}
														</span>
													</div>
												</div>
											</div>
										</li>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</ul>
					)}
				</Droppable>
			</DragDropContext>

			{/* Görsel Geribildirim */}
			{isDragging && (
				<div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
					Öğeyi istediğiniz konuma sürükleyin
				</div>
			)}

			<div className="border-t pt-6">
				<Button
					onClick={handleSubmit}
					className="w-full py-6 text-lg"
				>
					Önceliklendirmeyi Tamamla
					<ArrowRight className="ml-2" />
				</Button>
			</div>
		</div>
	)
}
