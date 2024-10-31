'use client'

import { Project } from '@/types/project'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar, ListTodo } from 'lucide-react'

interface ProjectDetailsProps {
	project: Project
	onUpdate: (project: Project) => void
	variant?: 'full' | 'compact'
}

export function ProjectDetails({
	project,
	onUpdate,
	variant = 'full',
}: ProjectDetailsProps) {
	const handleDateChange = (date: string) => {
		const newStartDate = new Date(date).getTime()
		onUpdate({
			...project,
			startDate: newStartDate,
			endDate: newStartDate + (project.endDate - project.startDate),
		})
	}

	if (variant === 'compact') {
		return (
			<div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
				<div className="flex items-center gap-2">
					<Calendar className="h-4 w-4" />
					<Input
						type="date"
						value={new Date(project.startDate).toISOString().split('T')[0]}
						onChange={(e) => handleDateChange(e.target.value)}
						className="h-8 w-auto"
					/>
				</div>
				<div className="flex items-center gap-2">
					<ListTodo className="h-4 w-4" />
					<span>Tasks: {project.tasks.length}</span>
				</div>
			</div>
		)
	}

	return (
		<div className="p-6 border rounded">
			<h2 className="text-xl font-semibold mb-4">Project Details</h2>
			<div className="space-y-4">
				<div>
					<h3 className="font-medium">Name</h3>
					<p>{project.name}</p>
				</div>
				<div>
					<Label>Project Start Date</Label>
					<Input
						type="date"
						value={new Date(project.startDate).toISOString().split('T')[0]}
						onChange={(e) => handleDateChange(e.target.value)}
						className="mt-1"
					/>
				</div>
				<div>
					<h3 className="font-medium">Start Date</h3>
					<p>{new Date(project.startDate).toLocaleDateString()}</p>
				</div>
				<div>
					<h3 className="font-medium">End Date</h3>
					<p>{new Date(project.endDate).toLocaleDateString()}</p>
				</div>
				<div>
					<h3 className="font-medium">Tasks</h3>
					<p>{project.tasks.length} tasks</p>
				</div>
			</div>
		</div>
	)
}
