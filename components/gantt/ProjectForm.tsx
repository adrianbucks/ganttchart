'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import type { Project } from '@/types/project'

export function ProjectForm({
	onProjectCreate,
}: {
	onProjectCreate: (project: Project) => void
}) {
	const [name, setName] = useState('')
	const [startDate, setStartDate] = useState(
		new Date().toISOString().split('T')[0]
	)

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		const start = new Date(startDate).getTime()
		const newProject = {
			id: crypto.randomUUID(),
			name,
			tasks: [],
			startDate: start,
			endDate: start + 7 * 24 * 60 * 60 * 1000, // Default 7 days duration
		}
		onProjectCreate(newProject)
		setName('')
		setStartDate(new Date().toISOString().split('T')[0])
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<Label>Project Name</Label>
				<Input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Enter project name"
					className="mt-1"
				/>
			</div>
			<div>
				<Label>Start Date</Label>
				<Input
					type="date"
					value={startDate}
					onChange={(e) => setStartDate(e.target.value)}
					className="mt-1"
				/>
			</div>
			<Button type="submit">Create Project</Button>
		</form>
	)
}
