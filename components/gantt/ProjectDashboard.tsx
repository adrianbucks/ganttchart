'use client'

import { useState } from 'react'
import { ProjectList } from '@/components/gantt/ProjectList'
import { ProjectDetails } from '@/components/gantt/ProjectDetails'
import { ProjectForm } from '@/components/gantt/ProjectForm'
import GanttChart from '@/components/gantt/GanttChart'
import { useProjects } from '@/hooks/useProjects'
import type { Project } from '@/types/project'

export function ProjectDashboard() {
	const { projects, addProject, deleteProject, updateProject } = useProjects()
	const [selectedProject, setSelectedProject] = useState<Project | null>(null)

	return (
		<div className="space-y-8">
			<div className="mb-8">
				<ProjectForm onProjectCreate={addProject} />
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<ProjectList
					projects={projects}
					selectedProject={selectedProject}
					onProjectSelect={setSelectedProject}
				/>

				{selectedProject && (
					<ProjectDetails
						project={selectedProject}
						onDelete={(id) => {
							deleteProject(id)
							setSelectedProject(null)
						}}
						onUpdate={(updatedProject) => {
							updateProject(updatedProject)
							setSelectedProject(updatedProject)
						}}
					/>
				)}
			</div>

			{selectedProject && <GanttChart project={selectedProject} />}
		</div>
	)
}
