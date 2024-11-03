import React from 'react'
import { Search } from 'lucide-react'
import { useTasks } from '@/hooks/useTasks'
import { Project } from '@/types/project'

interface TaskFilterProps {
	project: Project
}
export default function TaskFilter({ project }: TaskFilterProps) {
	const { searchTerm, filter, setSearchTerm, setFilter } = useTasks(project)

	return (
		<div className="flex gap-4 mb-4">
			<div className="relative flex-1">
				<Search
					className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
					size={16}
				/>
				<input
					type="text"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					placeholder="Search tasks..."
					className="w-full pl-10 pr-4 py-2 border rounded-md"
				/>
			</div>
			<select
				value={filter}
				onChange={(e) => setFilter(e.target.value)}
				className="border rounded-md px-3 py-2"
			>
				<option value="all">All Tasks</option>
				<option value="inProgress">In Progress</option>
				<option value="completed">Completed</option>
				<option value="upcoming">Upcoming</option>
			</select>
		</div>
	)
}
