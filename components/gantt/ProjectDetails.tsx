'use client'

import { Project } from '@/types/project'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ProjectDetailsProps {
	project: Project
	onDelete: (id: string) => void
	onUpdate: (project: Project) => void
}

export function ProjectDetails({
	project,
	onDelete,
	onUpdate,
}: ProjectDetailsProps) {
	const handleDateChange = (date: string) => {
		const newStartDate = new Date(date).getTime()
		onUpdate({
			...project,
			startDate: newStartDate,
		})
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
						value={
							new Date(project.startDate)
								.toISOString()
								.split('T')[0]
						}
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
				<Button
					variant="destructive"
					onClick={() => onDelete(project.id)}
				>
					Delete Project
				</Button>
			</div>
		</div>
	)
}
