import { Project } from '@/types/project'
import { Button } from '@/components/ui/button'
import { PlusCircle, Pencil, Trash2 } from 'lucide-react'

interface SidebarProps {
	projects: Project[]
	selectedProject: Project | null
	onProjectSelect: (project: Project | null) => void
	onNewProjectClick: () => void
	onEditProject: (project: Project) => void
	onDeleteProject: (projectId: string) => void
}

export function Sidebar({
	projects,
	selectedProject,
	onProjectSelect,
	onNewProjectClick,
	onEditProject,
	onDeleteProject,
}: SidebarProps) {
	return (
		<div className="w-64 h-screen border-r bg-background p-4 flex flex-col">
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-lg font-semibold">Projects</h2>
				<Button onClick={onNewProjectClick} variant="ghost" size="sm">
					<PlusCircle className="h-4 w-4" />
				</Button>
			</div>
			<div className="space-y-2">
				{projects.map((project) => (
					<div
						key={project.id}
						className={`p-3 rounded-md cursor-pointer transition-colors ${
							selectedProject?.id === project.id
								? 'bg-accent text-accent-foreground'
								: 'hover:bg-muted'
						}`}
					>
						<div className="flex justify-between items-center">
							<div onClick={() => onProjectSelect(project)}>
								<h3 className="font-medium truncate">
									{project.name}
								</h3>
								<p className="text-xs text-muted-foreground mt-1">
									Tasks: {project.tasks.length}
								</p>
							</div>
							<div className="flex items-center gap-2">
								<Button
									variant="ghost"
									size="icon"
									onClick={(e) => {
										e.stopPropagation()
										onEditProject(project)
									}}
								>
									<Pencil className="h-4 w-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									onClick={(e) => {
										e.stopPropagation()
										onDeleteProject(project.id)
									}}
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
