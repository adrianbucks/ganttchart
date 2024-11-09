import { Task } from "@/types/task"
import { cn } from "@/lib/utils"
import { ChevronRight, ChevronDown, FolderIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChartTaskGroupProps {
  groupId: string
  tasks: Task[]
  isExpanded: boolean
  level: number
  dimensions: {
    LABEL_WIDTH: number
    ROW_HEIGHT: number
    HEADER_HEIGHT: number
  }
  onToggle: (groupId: string) => void
  className?: string
}

export function ChartTaskGroup({
  groupId,
  tasks,
  isExpanded,
  level,
  dimensions,
  onToggle,
  className
}: ChartTaskGroupProps) {
  const groupTasks = tasks.filter(task => task.parentTask === groupId)
  const parentTask = tasks.find(task => task.id === groupId)
  
  if (!parentTask) return null

  const indent = level * 20

  return (
    <div className={cn("task-group", className)}>
      <div 
        className="group flex items-center gap-2 px-2 py-1 hover:bg-muted/50"
        style={{ paddingLeft: `${indent}px` }}
      >
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => onToggle(groupId)}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
        
        <FolderIcon className="h-4 w-4 text-muted-foreground" />
        
        <span className="font-medium">{parentTask.name}</span>
        
        <span className="text-xs text-muted-foreground ml-auto">
          {groupTasks.length} tasks
        </span>
      </div>

      {isExpanded && groupTasks.map(task => (
        <ChartTaskGroup
          key={task.id}
          groupId={task.id}
          tasks={tasks}
          isExpanded={isExpanded}
          level={level + 1}
          dimensions={dimensions}
          onToggle={onToggle}
        />
      ))}
    </div>
  )
}
