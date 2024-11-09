import { Task } from "@/types/task"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { 
  Edit, 
  Trash, 
  Plus, 
  Link, 
  Copy, 
  MoveVertical,
  BarChart2 
} from "lucide-react"

interface ChartTaskContextMenuProps {
  task: Task
  children: React.ReactNode
  onAction: (action: string, task: Task) => void
}

export function ChartTaskContextMenu({
  task,
  children,
  onAction
}: ChartTaskContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={() => onAction('edit', task)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Task
        </ContextMenuItem>
        
        <ContextMenuItem onClick={() => onAction('add-subtask', task)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Subtask
        </ContextMenuItem>

        <ContextMenuSeparator />
        
        <ContextMenuItem onClick={() => onAction('dependencies', task)}>
          <Link className="mr-2 h-4 w-4" />
          Dependencies
        </ContextMenuItem>
        
        <ContextMenuItem onClick={() => onAction('progress', task)}>
          <BarChart2 className="mr-2 h-4 w-4" />
          Update Progress
        </ContextMenuItem>

        <ContextMenuSeparator />
        
        <ContextMenuItem onClick={() => onAction('duplicate', task)}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </ContextMenuItem>
        
        <ContextMenuItem onClick={() => onAction('move', task)}>
          <MoveVertical className="mr-2 h-4 w-4" />
          Move Task
        </ContextMenuItem>

        <ContextMenuSeparator />
        
        <ContextMenuItem 
          onClick={() => onAction('delete', task)}
          className="text-destructive"
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete Task
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
