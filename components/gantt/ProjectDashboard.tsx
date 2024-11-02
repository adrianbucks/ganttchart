'use client'

import { useState } from 'react'
import { SidebarTrigger, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/gantt/AppSidebar'
import { ProjectFormModal } from './ProjectFormModal'
import GanttChart from './GanttChart'
import { useProjects } from '@/hooks/useProjects'
import type { Project } from '@/types/project'

export function ProjectDashboard() {
	const { projects, addProject, deleteProject, updateProject } = useProjects()
	const [selectedProject, setSelectedProject] = useState<Project | null>(null)
	const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false)
	const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false)

	const handleDeleteProject = (projectId: string) => {
		deleteProject(projectId)
		if (selectedProject?.id === projectId) {
			setSelectedProject(null)
		}
	}

	const handleEditProject = (project: Project) => {
		setSelectedProject(project)
		setIsEditProjectModalOpen(true)
	}

	return (
		<SidebarProvider defaultOpen={true}>
			<main className="flex h-screen">
				<AppSidebar
					projects={projects}
					selectedProject={selectedProject}
					onProjectSelect={setSelectedProject}
					onNewProjectClick={() => setIsNewProjectModalOpen(true)}
					onEditProject={handleEditProject}
					onDeleteProject={handleDeleteProject}
				/>
				<SidebarTrigger />
				<div className="flex-1 overflow-auto">
					{selectedProject ? (
						<GanttChart project={selectedProject} />
					) : (
						<div className="flex items-center justify-center h-full text-muted-foreground">
							Select a project to view its Gantt chart
						</div>
					)}
				</div>
				<ProjectFormModal
					open={isNewProjectModalOpen}
					onOpenChange={setIsNewProjectModalOpen}
					onProjectChange={addProject}
					onProjectSubmit={() => setIsNewProjectModalOpen(false)}
					mode="add"
				/>
				<ProjectFormModal
					open={isEditProjectModalOpen}
					onOpenChange={setIsEditProjectModalOpen}
					project={selectedProject}
					onProjectChange={updateProject}
					onProjectSubmit={() => setIsEditProjectModalOpen(false)}
					mode="edit"
				/>
			</main>
		</SidebarProvider>
	)
}
