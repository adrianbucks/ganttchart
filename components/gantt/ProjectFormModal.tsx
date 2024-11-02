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
	mode: 'add' | 'edit'
	disabled?: boolean
}

export function ProjectFormModal({
	project,
	open,
	onOpenChange,
	mode,
	disabled,
}: ProjectFormModalProps) {
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
						mode={mode}
						disabled={disabled}
						onSuccess={() => onOpenChange(false)}
					/>
				</DialogContent>
			</Dialog>
		</>
	)
}
