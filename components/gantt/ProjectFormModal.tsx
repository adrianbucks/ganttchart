import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { ProjectForm } from '@/components/gantt/ProjectForm'

import { Project } from '@/types/project'

interface ProjectFormModalProps {
	project?: Project | null | undefined
	open: boolean
	onOpenChange: (open: boolean) => void
	onProjectChange: (project: Project) => void
	onProjectSubmit: () => void
	mode: 'add' | 'edit'
	disabled?: boolean
}

export function ProjectFormModal({
	project,
	open,
	onOpenChange,
	onProjectChange,
	onProjectSubmit,
	mode,
	disabled,
}: ProjectFormModalProps) {
	const handleSubmit = () => {
		onProjectSubmit()
		onOpenChange(false)
	}

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="sm:max-w-[600px]">
					<DialogHeader>
						<DialogTitle>
							{mode === 'add'
								? 'Add New Project'
								: 'Edit Project'}
						</DialogTitle>
					</DialogHeader>
					<ProjectForm
						project={project}
						onProjectChange={onProjectChange}
						onProjectSubmit={handleSubmit}
						mode={mode}
						disabled={disabled}
					/>
				</DialogContent>
			</Dialog>
		</>
	)
}
