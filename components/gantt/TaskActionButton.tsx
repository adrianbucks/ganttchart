import { Button } from '@/components/ui/button'
import { PlusCircle, Pencil, Trash2 } from 'lucide-react'
import { Task } from '@/types/task'
import { useTasksContext } from '@/hooks/useTasksContext'

interface TaskActionButtonProps {
  action: 'add' | 'edit' | 'delete'
  task: Task
  showText?: boolean
  type?: Task['type']
  wrapper?: 'div' | 'button'
}

const actionIcons = {
  add: PlusCircle,
  edit: Pencil,
  delete: Trash2,
}

export function TaskActionButton({
  action,
  task,
  showText = true,
  type = 'task',
  wrapper = 'button',
}: TaskActionButtonProps) {
  const { setTaskToAction, setModalState, setTaskType } = useTasksContext()
  const Icon = actionIcons[action]
  const actionText = action.charAt(0).toUpperCase() + action.slice(1)

  const handleAction = () => {
    setTaskToAction(task)
    setTaskType(type)
    setModalState(true, action)
  }

  return wrapper === 'div' ? (
    <div onClick={handleAction} className="flex cursor-pointer">
      <Icon className="h-4 w-4" />
      {showText && <span className="ml-2">{actionText}</span>}
    </div>
  ) : (
    <Button
      onClick={handleAction}
      variant={action === 'delete' ? 'destructive' : 'outline'}
      size="sm"
    >
      <Icon className={showText ? 'mr-2 h-4 w-4' : 'h-4 w-4'} />
      {showText && actionText}
    </Button>
  )
}
