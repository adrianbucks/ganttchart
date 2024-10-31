'use client'

import { Project } from '@/types/project'

interface ProjectListProps {
	projects: Project[]
	selectedProject: Project | null
	onProjectSelect: (project: Project) => void
}

export function ProjectList({
	projects,
	selectedProject,
	onProjectSelect,
}: ProjectListProps) {
	return (
		<div>
			<h2 className="text-xl font-semibold mb-4">Your Projects</h2>
			<div className="space-y-4">
				{projects.map((project) => (
					<div
						key={project.id}
						className={`p-4 border rounded cursor-pointer hover:border-primary transition-colors ${
							selectedProject?.id === project.id
								? 'border-primary bg-accent'
								: ''
						}`}
						onClick={() => onProjectSelect(project)}
					>
						<h3 className="font-medium">{project.name}</h3>
						<p>Tasks: {project.tasks.length}</p>
					</div>
				))}
			</div>
		</div>
	)
}
