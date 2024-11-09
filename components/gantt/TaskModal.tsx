import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
  } from '@/components/ui/dialog'
  import { TaskForm } from '@/components/gantt/TaskForm'
  import { useTasksContext } from '@/hooks/useTasksContext'
  
  export function TaskModal() {
	const { state, setModalState } = useTasksContext()
	const { modalOpen, modalMode, taskType } = state
  
	return (
	  <Dialog
		open={modalOpen}
		onOpenChange={(open) => setModalState(open, modalMode)}
	  >
		<DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
		  <DialogHeader>
			<DialogTitle>
			  {`${modalMode === 'add' ? 'New' : 
				 modalMode === 'edit' ? 'Edit' : 
				 'Delete'} ${taskType}`}
			</DialogTitle>
		  </DialogHeader>
		  <TaskForm />
		</DialogContent>
	  </Dialog>
	)
  }
  