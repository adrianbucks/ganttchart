'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Task } from '@/types/project'
import { Textarea } from '@/components/ui/textarea'

interface TaskFormProps {
	tasks: Task[]
	task: Task
	onTaskChange: (task: Task) => void
	onTaskSubmit: () => void
	disabled?: boolean
	mode: 'add' | 'edit'
}

export function TaskForm({
	tasks,
	task,
	onTaskChange,
	onTaskSubmit,
	disabled,
	mode,
}: TaskFormProps) {
	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<Label htmlFor="name">Task Name</Label>
				<Input
					id="name"
					value={task.name}
					onChange={(e) =>
						onTaskChange({ ...task, name: e.target.value })
					}
					placeholder="Enter task name"
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="description">Description</Label>
				<Textarea
					id="description"
					value={task.description || ''}
					onChange={(e) =>
						onTaskChange({ ...task, description: e.target.value })
					}
					placeholder="Enter task description"
					rows={3}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="duration">Duration (days)</Label>
				<Input
					id="duration"
					type="number"
					min="1"
					value={task.duration}
					onChange={(e) =>
						onTaskChange({
							...task,
							duration: Number(e.target.value),
						})
					}
					placeholder="Enter duration"
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="dependencies">Dependencies</Label>
				<select
					id="dependencies"
					multiple
					value={task.dependencies || []}
					onChange={(e) =>
						onTaskChange({
							...task,
							dependencies: Array.from(
								e.target.selectedOptions,
								(option) => option.value
							),
						})
					}
					className="w-full rounded-md border border-input bg-transparent px-3 py-2 min-h-[100px]"
				>
					{tasks.map((t) => (
						<option key={t.id} value={t.id}>
							{t.name}
						</option>
					))}
				</select>
				<p className="text-sm text-muted-foreground">
					Hold Ctrl/Cmd to select multiple tasks
				</p>
			</div>

			<div className="flex justify-end pt-4">
				<Button onClick={onTaskSubmit} disabled={disabled}>
					{mode === 'add' ? 'Add Task' : 'Update Task'}
				</Button>
			</div>
		</div>
	)
}
