import { useState, useRef } from 'react'
import { Task } from '@/types/task'
import { cn } from '@/lib/utils'
import { addDays, differenceInDays } from 'date-fns'

interface ChartTaskDragProps {
	task: Task
	tasks: Task[]
	dimensions: {
		LABEL_WIDTH: number
		ROW_HEIGHT: number
		HEADER_HEIGHT: number
		DAY_WIDTH: number
	}
	startDate: Date
	onDragEnd: (
		taskId: string,
		newStartDate: Date,
		newEndDate: Date,
		newOrder: number
	) => void
	className?: string
}

export function ChartTaskDrag({
	task,
	tasks,
	dimensions,
	onDragEnd,
	className,
}: ChartTaskDragProps) {
	const [isDragging, setIsDragging] = useState(false)
	const dragStart = useRef({ x: 0, y: 0 })
	const originalPosition = useRef({
		startDate: task.startDate,
		order: task.order,
	})

	const handleDragStart = (e: React.MouseEvent) => {
		e.preventDefault()
		setIsDragging(true)
		dragStart.current = { x: e.clientX, y: e.clientY }
		originalPosition.current = {
			startDate: task.startDate,
			order: task.order,
		}
	}

	const handleDrag = (e: React.MouseEvent) => {
		if (!isDragging) return

		const deltaX = e.clientX - dragStart.current.x
		const deltaY = e.clientY - dragStart.current.y

		const daysDelta = Math.round(deltaX / dimensions.DAY_WIDTH)
		const orderDelta = Math.round(deltaY / dimensions.ROW_HEIGHT)

		const newStartDate = addDays(
			originalPosition.current.startDate,
			daysDelta
		)
		const duration = differenceInDays(task.endDate, task.startDate)
		const newEndDate = addDays(newStartDate, duration)

		const newOrder = Math.max(
			0,
			Math.min(
				originalPosition.current.order + orderDelta,
				tasks.length - 1
			)
		)

		onDragEnd(task.id, newStartDate, newEndDate, newOrder)
	}

	const handleDragEnd = () => {
		setIsDragging(false)
	}

	return (
		<div
			className={cn(
				'absolute cursor-move',
				isDragging && 'opacity-75',
				className
			)}
			style={{
				left:
					dimensions.LABEL_WIDTH + task.order * dimensions.DAY_WIDTH,
				top:
					dimensions.HEADER_HEIGHT +
					task.order * dimensions.ROW_HEIGHT,
				width:
					differenceInDays(task.endDate, task.startDate) *
					dimensions.DAY_WIDTH,
				height: dimensions.ROW_HEIGHT,
			}}
			onMouseDown={handleDragStart}
			onMouseMove={handleDrag}
			onMouseUp={handleDragEnd}
			onMouseLeave={handleDragEnd}
		/>
	)
}
