import { differenceInDays } from "date-fns"
import { cn } from "@/lib/utils"
import { Task } from "@/types/task"

interface ChartDependencyProps {
  fromTask: Task
  toTask: Task
  hoveredTaskId: string | null
  arrowStyle: 'curved' | 'squared'
  dimensions: {
    HEADER_HEIGHT: number
    ROW_HEIGHT: number
    LABEL_WIDTH: number
    DAY_WIDTH: number
  }
  startDate: Date
  customColors?: {
    arrow?: string
    highlighted?: string
  }
}

export function ChartDependency({
  fromTask,
  toTask,
  hoveredTaskId,
  arrowStyle,
  dimensions,
  startDate,
  customColors
}: ChartDependencyProps) {
  const { HEADER_HEIGHT, ROW_HEIGHT, LABEL_WIDTH, DAY_WIDTH } = dimensions

  const getXFromDate = (date: Date) => {
    const days = differenceInDays(date, startDate)
    return LABEL_WIDTH + days * DAY_WIDTH
  }

  const fromX = getXFromDate(fromTask.endDate)
  const fromY = fromTask.order * ROW_HEIGHT + HEADER_HEIGHT + ROW_HEIGHT / 2
  const toX = getXFromDate(toTask.startDate)
  const toY = toTask.order * ROW_HEIGHT + HEADER_HEIGHT + ROW_HEIGHT / 2

  const getDependencyPath = () => {
    if (arrowStyle === 'curved') {
      const midX = (fromX + toX) / 2
      return `M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`
    } else {
      const midY = (fromY + toY) / 2
      const offset = 10
      return `M ${fromX} ${fromY} 
              H ${fromX + offset} 
              V ${midY} 
              H ${toX - offset} 
              V ${toY} 
              H ${toX}`
    }
  }

  const isHighlighted = hoveredTaskId === fromTask.id || hoveredTaskId === toTask.id

  return (
    <>
      <path
        d={getDependencyPath()}
        className={cn(
          "fill-none transition-all",
          isHighlighted
            ? cn("stroke-primary stroke-2", customColors?.highlighted)
            : cn("stroke-muted-foreground stroke-1", customColors?.arrow)
        )}
        markerEnd="url(#arrowhead)"
      />
      
      {/* Optional: Add interaction area for hover effects */}
      <path
        d={getDependencyPath()}
        className="fill-none stroke-transparent stroke-[8px] cursor-pointer"
        onMouseEnter={() => {/* Optional hover handler */}}
        onMouseLeave={() => {/* Optional hover handler */}}
      />
    </>
  )
}
