import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, Plus } from "lucide-react"
import { Task } from "@/types/task"
import { TaskActionButton } from "./TaskActionButton"

interface ChartSidebarProps {
  tasks: Task[]
  dimensions: {
    LABEL_WIDTH: number
    ROW_HEIGHT: number
    HEADER_HEIGHT: number
  }
  expandedGroups: Set<string>
  onToggleGroup: (groupId: string) => void
  onTaskAction: (action: 'add' | 'edit' | 'delete', task: Task) => void
  className?: string
}

export function ChartSidebar({
  tasks,
  dimensions,
  expandedGroups,
  onToggleGroup,
  onTaskAction,
  className
}: ChartSidebarProps) {
  const { LABEL_WIDTH, ROW_HEIGHT, HEADER_HEIGHT } = dimensions

  const renderTaskRow = (task: Task, level: number = 0) => {
    const hasChildren = tasks.some(t => t.parentTask === task.id)
    const isExpanded = expandedGroups.has(task.id)
    const indent = level * 20

    return (
      <g key={task.id}>
        <foreignObject
          x={indent}
          y={task.order * ROW_HEIGHT + HEADER_HEIGHT}
          width={LABEL_WIDTH - indent}
          height={ROW_HEIGHT}
        >
          <div className="flex items-center h-full px-2 gap-2">
            {hasChildren && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => onToggleGroup(task.id)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            )}
            
            <span className="flex-1 truncate">{task.name}</span>
            
            <div className="flex items-center gap-1">
              <TaskActionButton
                action="add"
                task={task}
                type={task.type}
                showText={false}
              />
              <TaskActionButton
                action="edit"
                task={task}
                showText={false}
              />
              <TaskActionButton
                action="delete"
                task={task}
                showText={false}
              />
            </div>
          </div>
        </foreignObject>
      </g>
    )
  }

  return (
    <g className={className}>
      {/* Header */}
      <foreignObject
        x={0}
        y={0}
        width={LABEL_WIDTH}
        height={HEADER_HEIGHT}
      >
        <div className="h-full flex items-center px-4 bg-muted/50">
          <span className="font-medium">Tasks</span>
        </div>
      </foreignObject>

      {/* Task Rows */}
      {tasks.map(task => {
        if (!task.parentTask) {
          return renderTaskRow(task)
        }
        return null
      })}
    </g>
  )
}
