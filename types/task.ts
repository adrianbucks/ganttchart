export type TaskType = 'task' | 'milestone' | 'project'
export type TaskStatus = 'todo' | 'in-progress' | 'completed'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface TaskVisualSettings {
	barStyle: 'solid' | 'striped' | 'gradient'
	labelPosition: 'inside' | 'outside'
	showProgress: boolean
	showDependencies: boolean
	color?: string
}

export interface Task {
	id: string
	name: string
	description?: string
	type: TaskType
	startDate: number
	endDate: number
	duration: number
	progress: number
	order: number
	dependencies?: string[]
	parentTask?: string
	slack?: number
	status: TaskStatus
	priority: TaskPriority
	visualSettings: TaskVisualSettings
}

export const defaultTaskVisualSettings: TaskVisualSettings = {
	barStyle: 'solid',
	labelPosition: 'outside',
	showProgress: true,
	showDependencies: true,
}

export const defaultTask: Partial<Task> = {
	type: 'task',
	progress: 0,
	status: 'todo',
	priority: 'medium',
	visualSettings: defaultTaskVisualSettings,
}
