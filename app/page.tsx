'use client'

import { ProjectDashboard } from '@/components/gantt/ProjectDashboard'

export default function Home() {
	return (
		<main className="container mx-auto p-4">
			<h1 className="text-3xl font-bold mb-6">Project Management</h1>
			<ProjectDashboard />
		</main>
	)
}
