'use client'

import { Task } from '@/types/project'

interface TaskBarProps {
	task: Task
	index: number
	startOffset: number
	duration: number
	taskHeight: number
	dayWidth: number
}

export function TaskBar({
	task,
	index,
	startOffset,
	duration,
	taskHeight,
	dayWidth,
}: TaskBarProps) {
	return (
		<g>
			<rect
				x={startOffset * dayWidth}
				y={index * taskHeight + 60}
				width={duration * dayWidth}
				height={taskHeight - 10}
				fill="#60a5fa"
				rx="5"
			/>
			<text
				x={startOffset * dayWidth + 5}
				y={index * taskHeight + 80}
				fill="white"
				fontSize="12"
			>
				{task.name.length > 30
					? `${task.name.substring(0, 30)}...`
					: task.name}
			</text>
		</g>
	)
}
