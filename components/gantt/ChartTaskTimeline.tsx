import { Task } from "@/types/task"
import { cn } from "@/lib/utils"
import { format, eachDayOfInterval, isToday } from "date-fns"

interface ChartTaskTimelineProps {
  tasks: Task[]
  startDate: Date
  endDate: Date
  dimensions: {
    LABEL_WIDTH: number
    ROW_HEIGHT: number
    HEADER_HEIGHT: number
    DAY_WIDTH: number
  }
  className?: string
}

export function ChartTaskTimeline({
  tasks,
  startDate,
  endDate,
  dimensions,
  className
}: ChartTaskTimelineProps) {
  const days = eachDayOfInterval({ start: startDate, end: endDate })

  return (
    <div className={cn("relative", className)}>
      {/* Timeline Header */}
      <div 
        className="flex border-b"
        style={{ marginLeft: dimensions.LABEL_WIDTH }}
      >
        {days.map((day, index) => (
          <div
            key={index}
            className={cn(
              "flex-shrink-0 border-r px-2 py-1",
              isToday(day) && "bg-primary/10"
            )}
            style={{ width: dimensions.DAY_WIDTH }}
          >
            <div className="text-xs font-medium">
              {format(day, 'EEE')}
            </div>
            <div className="text-xs text-muted-foreground">
              {format(day, 'd MMM')}
            </div>
          </div>
        ))}
      </div>

      {/* Task Rows */}
      {tasks.map((task, index) => (
        <div
          key={task.id}
          className="flex items-center border-b"
          style={{ height: dimensions.ROW_HEIGHT }}
        >
          <div 
            className="flex-shrink-0 px-4 font-medium"
            style={{ width: dimensions.LABEL_WIDTH }}
          >
            {task.name}
          </div>
          <div className="flex-1 relative">
            {/* Task Bar */}
            <div
              className="absolute h-6 rounded-md bg-primary"
              style={{
                left: `${getTaskOffset(task.startDate, startDate) * dimensions.DAY_WIDTH}px`,
                width: `${getTaskDuration(task.startDate, task.endDate) * dimensions.DAY_WIDTH}px`,
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function getTaskOffset(taskStart: Date, timelineStart: Date): number {
  return Math.max(0, Math.floor((taskStart.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24)))
}

function getTaskDuration(start: Date, end: Date): number {
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}
