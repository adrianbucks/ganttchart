import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Task } from '@/types/task'
import { TaskActionButton } from './TaskActionButton'
import { ChartDimensions } from '@/lib/visualization-utils'

interface ChartSidebarProps {
  tasks: Task[]
  dimensions: ChartDimensions
  expandedGroups: Set<string>
  onToggleGroup: (groupId: string) => void
  className?: string
}

export function ChartSidebar({
  tasks,
  dimensions,
  expandedGroups,
  onToggleGroup,
  className,
}: ChartSidebarProps) {
  const renderTaskRow = (task: Task, level: number = 0) => {
    const hasChildren = tasks.some((t) => t.parentTask === task.id)
    const isExpanded = expandedGroups.has(task.id)
    const indent = level * 20
	const verticalPosition = (tasks.indexOf(task) + 1) * dimensions.ROW_HEIGHT + dimensions.HEADER_HEIGHT

    return (
      <g key={task.id}>
        <foreignObject
          x={indent}
          y={verticalPosition}
          width={dimensions.LABEL_WIDTH - indent}
          height={dimensions.ROW_HEIGHT}
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
      <foreignObject
        x={0}
        y={0}
        width={dimensions.LABEL_WIDTH}
        height={dimensions.HEADER_HEIGHT}
      >
        <div className="h-full flex items-center px-4 bg-muted/50">
          <span className="font-medium">Tasks</span>
        </div>
      </foreignObject>

      {tasks.map((task) => renderTaskRow(task))}
    </g>
  )
}
