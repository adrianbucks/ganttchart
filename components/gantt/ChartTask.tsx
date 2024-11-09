import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Task } from "@/types/task"

interface ChartTaskProps {
  task: Task
  index: number
  dimensions: {
    HEADER_HEIGHT: number
    ROW_HEIGHT: number
    LABEL_WIDTH: number
    DAY_WIDTH: number
  }
  isHovered: boolean
  isSelected: boolean
  showTaskLabels: boolean
  startDate: Date
  onHover: (id: string | null) => void
  onSelect: (id: string | null) => void
  customColors?: {
    taskBar?: string
    progress?: string
    selected?: string
    hover?: string
  }
}

export function ChartTask({
  task,
  index,
  dimensions,
  isHovered,
  isSelected,
  showTaskLabels,
  startDate,
  onHover,
  onSelect,
  customColors
}: ChartTaskProps) {
  const { HEADER_HEIGHT, ROW_HEIGHT, LABEL_WIDTH, DAY_WIDTH } = dimensions

  const getXFromDate = (date: Date) => {
    const days = differenceInDays(date, startDate)
    return LABEL_WIDTH + days * DAY_WIDTH
  }

  const taskStart = getXFromDate(task.startDate)
  const taskEnd = getXFromDate(task.endDate)
  const taskWidth = taskEnd - taskStart
  const y = HEADER_HEIGHT + index * ROW_HEIGHT

  return (
    <g
      onMouseEnter={() => onHover(task.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onSelect(task.id)}
      className="cursor-pointer"
    >
      {showTaskLabels && (
        <text
          x={LABEL_WIDTH - 8}
          y={y + ROW_HEIGHT / 2}
          className={cn(
            "fill-foreground transition-colors",
            isSelected && "font-bold"
          )}
          textAnchor="end"
          dominantBaseline="middle"
        >
          {task.name}
        </text>
      )}

      <Tooltip>
        <TooltipTrigger asChild>
          <g>
            {/* Background bar */}
            <rect
              x={taskStart}
              y={y + ROW_HEIGHT / 4}
              width={taskWidth}
              height={ROW_HEIGHT / 2}
              rx={4}
              className={cn(
                "fill-muted transition-colors",
                isHovered && "fill-muted/80",
                isSelected && "stroke-primary stroke-2",
                customColors?.taskBar
              )}
            />

            {/* Progress bar */}
            <rect
              x={taskStart}
              y={y + ROW_HEIGHT / 4}
              width={taskWidth * (task.progress / 100)}
              height={ROW_HEIGHT / 2}
              rx={4}
              fill={task.color || customColors?.progress || "hsl(var(--primary))"}
              className={cn(
                "transition-colors",
                isHovered && "opacity-80"
              )}
            />

            {/* Slack indicator */}
            {task.slack && task.slack > 0 && (
              <rect
                x={taskEnd}
                y={y + ROW_HEIGHT / 4}
                width={task.slack * DAY_WIDTH}
                height={ROW_HEIGHT / 2}
                rx={4}
                className="fill-primary/20"
                strokeDasharray="4 4"
              />
            )}
          </g>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-medium">{task.name}</p>
            <p>Progress: {task.progress}%</p>
            <p>Start: {format(task.startDate, 'MMM d, yyyy')}</p>
            <p>End: {format(task.endDate, 'MMM d, yyyy')}</p>
            {task.type && <p>Type: {task.type}</p>}
          </div>
        </TooltipContent>
      </Tooltip>
    </g>
  )
}
