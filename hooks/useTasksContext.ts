import { useContext } from 'react'
import { TasksContext } from '@/components/gantt/TasksContext'

export function useTasksContext() {
	const context = useContext(TasksContext)
	if (context === undefined) {
		throw new Error('useTasksContext must be used within a TasksProvider')
	}
	return context
}
