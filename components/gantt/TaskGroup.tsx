import React from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Task } from '@/types/project'

interface TaskGroupProps {
	name: string
	tasks: Task[]
	isExpanded: boolean
	onToggle: () => void
}

const TaskGroup = ({ name, tasks, isExpanded, onToggle }: TaskGroupProps) => {
	return (
		<div className="mb-4">
			<button
				onClick={onToggle}
				className="flex items-center gap-2 w-full text-left p-2 hover:bg-muted rounded-md"
			>
				{isExpanded ? (
					<ChevronDown size={16} />
				) : (
					<ChevronRight size={16} />
				)}
				<span className="font-medium">{name}</span>
				<span className="text-muted-foreground ml-2">
					({tasks.length})
				</span>
			</button>
			{isExpanded && (
				<div className="pl-6 mt-2">
					{tasks.map((task) => (
						<div key={task.id} className="py-1">
							{task.name}
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default TaskGroup
