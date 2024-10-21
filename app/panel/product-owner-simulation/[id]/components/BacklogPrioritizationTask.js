import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
	DragDropContext,
	Droppable,
	Draggable
} from '@hello-pangea/dnd'

export default function BacklogPrioritizationTask({
	simulation,
	onComplete
}) {
	const [backlog, setBacklog] = useState([])
	const [error, setError] = useState(null)

	useEffect(() => {
		if (simulation && simulation.backlogPrioritization) {
			// Ensure each item has a string id
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
		return <p className="text-red-500">{error}</p>
	}

	if (backlog.length === 0) {
		return <p>Yükleniyor...</p>
	}

	return (
		<div className="space-y-6">
			<h2 className="text-xl font-semibold">
				Backlog Önceliklendirme
			</h2>
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId="backlog">
					{(provided) => (
						<ul
							{...provided.droppableProps}
							ref={provided.innerRef}
							className="space-y-2"
						>
							{backlog.map((item, index) => (
								<Draggable
									key={item.id}
									draggableId={item.id}
									index={index}
								>
									{(provided) => (
										<li
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
											className="p-4 bg-white shadow rounded"
										>
											<div className="font-medium">{item.title}</div>
											<div className="text-sm text-gray-500">
												{item.description}
											</div>
											<div className="text-sm text-gray-500">
												Story Points: {item.storyPoints}
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
			<Button onClick={handleSubmit}>Tamamla</Button>
		</div>
	)
}
