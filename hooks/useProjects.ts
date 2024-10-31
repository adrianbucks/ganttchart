'use client'

import useLocalStorage from '@/hooks/useLocalStorage'
import type { Project } from '@/types/project'

export function useProjects() {
	const [projects, setProjects] = useLocalStorage<Project[]>(
		'gantt-projects',
		[]
	)

	const addProject = (project: Project) => {
		setProjects([...projects, project])
	}

	const updateProject = (updatedProject: Project) => {
		setProjects(
			projects.map((p) =>
				p.id === updatedProject.id ? updatedProject : p
			)
		)
	}

	const deleteProject = (projectId: string) => {
		setProjects(projects.filter((p) => p.id !== projectId))
	}

	return { projects, addProject, updateProject, deleteProject }
}
