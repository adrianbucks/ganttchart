'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Edit2, Save, X } from 'lucide-react'
import { Task } from '@/types/project'
import { useState } from 'react'

interface TaskListProps {
	tasks: Task[]
	onTaskDelete: (taskId: string) => void
	onTaskUpdate: (task: Task) => void
	isEditing: string | null
	setIsEditing: React.Dispatch<React.SetStateAction<string | null>>
}

export function TaskList({ tasks, onTaskDelete, onTaskUpdate }: TaskListProps) {
	const [editingTask, setEditingTask] = useState<string | null>(null)
	const [editForm, setEditForm] = useState<Task | null>(null)

	const startEditing = (task: Task) => {
		setEditingTask(task.id)
		setEditForm(task)
	}

	const saveEdit = () => {
		if (editForm) {
			onTaskUpdate(editForm)
			setEditingTask(null)
			setEditForm(null)
		}
	}

	return (
		<div className="mb-6">
			<h2 className="text-lg font-semibold mb-2">Tasks</h2>
			<div className="space-y-2">
				{tasks.map((task) => (
					<div
						key={task.id}
						className="flex items-center justify-between bg-gray-50 p-2 rounded"
					>
						{editingTask === task.id ? (
							<div className="flex-1 grid grid-cols-4 gap-2">
								<Input
									value={editForm?.name}
									onChange={(e) =>
										setEditForm({
											...editForm!,
											name: e.target.value,
										})
									}
								/>
								<Input
									type="number"
									value={editForm?.duration}
									onChange={(e) =>
										setEditForm({
											...editForm!,
											duration: Number(e.target.value),
										})
									}
								/>
								<select
									multiple
									value={editForm?.dependencies}
									onChange={(e) =>
										setEditForm({
											...editForm!,
											dependencies: Array.from(
												e.target.selectedOptions,
												(option) => option.value
											),
										})
									}
									className="border rounded"
								>
									{tasks
										.filter((t) => t.id !== task.id)
										.map((t) => (
											<option key={t.id} value={t.id}>
												{t.name}
											</option>
										))}
								</select>
								<div className="flex gap-2">
									<Button size="sm" onClick={saveEdit}>
										<Save className="h-4 w-4" />
									</Button>
									<Button
										size="sm"
										variant="ghost"
										onClick={() => setEditingTask(null)}
									>
										<X className="h-4 w-4" />
									</Button>
								</div>
							</div>
						) : (
							<>
								<div>
									<span className="font-medium">
										{task.name}
									</span>
									<span className="text-sm text-gray-500 ml-2">
										(
										{new Date(
											task.startDate
										).toLocaleDateString()}{' '}
										-{' '}
										{new Date(
											task.endDate
										).toLocaleDateString()}
										)
									</span>
									{(task.dependencies?.length ?? 0) > 0 && (
										<div className="text-xs text-gray-400">
											Dependencies:{' '}
											{(task.dependencies ?? [])
												.map(
													(depId) =>
														tasks.find(
															(t) =>
																t.id === depId
														)?.name
												)
												.join(', ')}
										</div>
									)}
								</div>
								<div className="flex gap-2">
									<Button
										variant="ghost"
										size="sm"
										onClick={() => startEditing(task)}
									>
										<Edit2 className="h-4 w-4" />
									</Button>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => onTaskDelete(task.id)}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</>
						)}
					</div>
				))}
			</div>
		</div>
	)
}
