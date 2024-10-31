// import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { ProjectForm } from './ProjectForm'
import { Project } from '@/types/project'

interface ProjectFormModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	onProjectCreate: (project: Project) => void
	project?: Project | null
}

export function ProjectFormModal({
	open,
	onOpenChange,
	onProjectCreate,
}: ProjectFormModalProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create New Project</DialogTitle>
				</DialogHeader>
				<ProjectForm
					onProjectCreate={(project) => {
						onProjectCreate(project)
						onOpenChange(false)
					}}
				/>
			</DialogContent>
		</Dialog>
	)
}
