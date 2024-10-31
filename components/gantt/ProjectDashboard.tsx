'use client'

import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { ProjectFormModal } from './ProjectFormModal'
import GanttChart from './GanttChart'
import { useProjects } from '@/hooks/useProjects'
import type { Project } from '@/types/project'

export function ProjectDashboard() {
	const { projects, addProject, deleteProject, updateProject } = useProjects()
	const [selectedProject, setSelectedProject] = useState<Project | null>(null)
	const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false)
	const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const handleDeleteProject = (projectId: string) => {
		deleteProject(projectId)
		if (selectedProject?.id === projectId) {
			setSelectedProject(null)
		}
	}

	const handleEditProject = (project: Project) => {
		setSelectedProject(project)
		setIsModalOpen(true)
	}

	// const handleModalClose = () => {
	// 	setIsModalOpen(false)
	// 	setSelectedProject(null)
	// }

	const handleProjectCreate = (project: Project) => {
		addProject(project)
		setIsModalOpen(false)
		setSelectedProject(null)
	}

	return (
		<div className="flex h-screen">
			<Sidebar
				projects={projects}
				selectedProject={selectedProject}
				onProjectSelect={setSelectedProject}
				onNewProjectClick={() => {
					setSelectedProject(null)
					setIsModalOpen(true)
				}}
				onEditProject={handleEditProject}
				onDeleteProject={handleDeleteProject}
			/>
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
				onProjectCreate={addProject}
			/>
			<ProjectFormModal
				open={isEditProjectModalOpen}
				onOpenChange={setIsEditProjectModalOpen}
				onProjectCreate={updateProject}
				project={selectedProject}
			/>
			{isModalOpen && (
				<ProjectFormModal
					open={isModalOpen}
					onOpenChange={setIsModalOpen}
					onProjectCreate={handleProjectCreate}
					project={selectedProject}
					// onClose={handleModalClose}
				/>
			)}
		</div>
	)
}
