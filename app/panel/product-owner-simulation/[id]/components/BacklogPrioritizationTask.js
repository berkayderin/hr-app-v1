import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
	DragDropContext,
	Droppable,
	Draggable
} from '@hello-pangea/dnd'

const initialBacklog = [
	{
		id: 'item1',
		content: 'Kullanıcı kaydı özelliği',
		priority: 'Yüksek'
	},
	{ id: 'item2', content: 'Raporlama modülü', priority: 'Orta' },
	{
		id: 'item3',
		content: 'Performans iyileştirmeleri',
		priority: 'Düşük'
	}
	// Daha fazla backlog öğesi ekleyin
]

export default function BacklogPrioritizationTask({ onComplete }) {
	const [backlog, setBacklog] = useState(initialBacklog)

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
											<div className="font-medium">
												{item.content}
											</div>
											<div className="text-sm text-gray-500">
												Öncelik: {item.priority}
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
