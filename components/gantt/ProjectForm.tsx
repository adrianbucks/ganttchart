'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

import type { Project } from '@/types/project'

interface ProjectFormProps {
	project?: Project | null | undefined
	onProjectChange?: (project: Project) => void
	onProjectSubmit?: (project: Project) => void
	mode: 'add' | 'edit'
	disabled?: boolean
}
export function ProjectForm({
	project,
	onProjectChange,
	onProjectSubmit,
	mode,
	disabled,
}: ProjectFormProps) {
	const [formData, setFormData] = useState({
		id: project?.id || crypto.randomUUID(),
		name: project?.name || '',
		description: project?.description || '',
		tasks: project?.tasks || [],
		startDate: project?.startDate || new Date().getTime(),
		endDate:
			project?.endDate || new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
	})

	const handleChange = (field: keyof Project, value: string | number) => {
		const updatedProject = { ...formData, [field]: value }
		setFormData(updatedProject)
		onProjectChange?.(updatedProject)
	}

	const handleSubmit = () => {
		onProjectSubmit?.(formData)
	}

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<Label htmlFor="name">Project Name</Label>
				<Input
					id="name"
					value={formData.name}
					onChange={(e) => handleChange('name', e.target.value)}
					placeholder="Enter project name"
					disabled={disabled}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="description">Description</Label>
				<Textarea
					id="description"
					value={formData.description}
					onChange={(e) =>
						handleChange('description', e.target.value)
					}
					placeholder="Enter project description"
					rows={3}
					disabled={disabled}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="startDate">Start Date</Label>
				<Input
					id="startDate"
					type="date"
					value={
						new Date(formData.startDate).toISOString().split('T')[0]
					}
					onChange={(e) =>
						handleChange(
							'startDate',
							new Date(e.target.value).getTime()
						)
					}
					disabled={disabled}
				/>
			</div>

			<div className="flex justify-end pt-4">
				<Button onClick={handleSubmit} disabled={disabled}>
					{mode === 'add' ? 'Create Project' : 'Update Project'}
				</Button>
			</div>
		</div>
	)
}
