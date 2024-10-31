'use client'

import { useState } from 'react'

import type { Project } from '@/types/project'

export function ProjectForm({
	onProjectCreate,
}: {
	onProjectCreate: (project: Project) => void
}) {
	const [name, setName] = useState('')

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		const now = Date.now()
		const newProject = {
			id: crypto.randomUUID(),
			name,
			tasks: [],
			startDate: now,
			endDate: now + 7 * 24 * 60 * 60 * 1000, // Default 7 days duration
		}
		onProjectCreate(newProject)
		setName('')
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<input
				type="text"
				value={name}
				onChange={(e) => setName(e.target.value)}
				className="border rounded p-2"
				placeholder="Project name"
			/>
			<button
				type="submit"
				className="bg-primary text-primary-foreground px-4 py-2 rounded"
			>
				Create Project
			</button>
		</form>
	)
}
