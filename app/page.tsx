'use client'

import { ProjectDashboard } from '@/components/gantt/ProjectDashboard'
import { TasksProvider } from '@/components/gantt/TasksContext'

export default function Home() {
	return (
		<TasksProvider>
			<main>
				<ProjectDashboard />
			</main>
		</TasksProvider>
	)
}
