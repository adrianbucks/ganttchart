interface Project {
	id: string
	name: string
	tasks: Task[]
	startDate: number
	endDate: number
	color?: string
}

interface Task {
	id: string
	name: string
	startDate: number
	endDate: number
	duration?: number
	progress: number
	dependencies?: string[]
	assignee?: string
}

export { Project, Task }
