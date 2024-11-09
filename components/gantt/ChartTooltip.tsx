import { format } from "date-fns"
import { Task } from "@/types/task"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ChartTooltipProps {
  task: Task
  children: React.ReactNode
  className?: string
  showProgress?: boolean
  showDates?: boolean
  showDuration?: boolean
  customContent?: (task: Task) => React.ReactNode
}

export function ChartTooltip({
  task,
  children,
  className,
  showProgress = true,
  showDates = true,
  showDuration = true,
  customContent
}: ChartTooltipProps) {
  const getDuration = () => {
    const diff = Math.ceil(
      (task.endDate.getTime() - task.startDate.getTime()) / (1000 * 60 * 60 * 24)
    )
    return `${diff} day${diff !== 1 ? 's' : ''}`
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          className={cn("max-w-[300px] space-y-2", className)}
          side="top"
          align="start"
        >
          {customContent ? (
            customContent(task)
          ) : (
            <>
              <div className="font-medium">{task.name}</div>
              {showProgress && (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                  <span className="text-xs">{task.progress}%</span>
                </div>
              )}
              {showDates && (
                <div className="text-sm space-y-1">
                  <div>Start: {format(task.startDate, 'MMM d, yyyy')}</div>
                  <div>End: {format(task.endDate, 'MMM d, yyyy')}</div>
                </div>
              )}
              {showDuration && (
                <div className="text-sm text-muted-foreground">
                  Duration: {getDuration()}
                </div>
              )}
              {task.type && (
                <div className="text-sm">
                  Type: <span className="capitalize">{task.type}</span>
                </div>
              )}
            </>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
