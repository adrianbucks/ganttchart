'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { useProjects } from '@/hooks/useProjects'

import type { Project } from '@/types/project'

interface ProjectFormProps {
	project?: Project | null | undefined
	mode: 'add' | 'edit'
	disabled?: boolean
	onSuccess?: () => void
}
export function ProjectForm({
	project,
	mode,
	disabled,
	onSuccess,
}: ProjectFormProps) {
	const { addProject, updateProject } = useProjects()
	const [formData, setFormData] = useState({
		id: project?.id || crypto.randomUUID(),
		name: project?.name || '',
		description: project?.description || '',
		tasks: project?.tasks || [],
		startDate: project?.startDate || new Date().getTime(),
		endDate:
			project?.endDate || new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
	})

	const handleChange = (
		field: keyof Project,
		value: string | number | []
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }))
	}

	const handleSubmit = () => {
		if (mode === 'add') {
			addProject(formData)
			toast({
				title: formData.name,
				description: 'Project added successfully',
			})
		} else {
			updateProject(formData)
			toast({
				title: formData.name,
				description: 'Project updated successfully',
			})
		}
		onSuccess?.()
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
