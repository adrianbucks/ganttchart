import { Task } from "@/types/task"
import { cn } from "@/lib/utils"
import { Flag, Star } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Milestone {
  id: string
  name: string
  date: Date
  type: 'milestone' | 'deliverable'
  relatedTasks?: string[]
}

interface ChartTaskMilestonesProps {
  milestones: Milestone[]
  tasks: Task[]
  dimensions: {
    LABEL_WIDTH: number
    CHART_HEIGHT: number
    HEADER_HEIGHT: number
    DAY_WIDTH: number
  }
  startDate: Date
  className?: string
}

export function ChartTaskMilestones({
  milestones,
  tasks,
  dimensions,
  startDate,
  className
}: ChartTaskMilestonesProps) {
  const getXPosition = (date: Date) => {
    const days = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    return dimensions.LABEL_WIDTH + (days * dimensions.DAY_WIDTH)
  }

  return (
    <TooltipProvider>
      <g className={className}>
        {milestones.map(milestone => (
          <g
            key={milestone.id}
            transform={`translate(${getXPosition(milestone.date)}, ${dimensions.HEADER_HEIGHT - 10})`}
          >
            <Tooltip>
              <TooltipTrigger>
                {milestone.type === 'milestone' ? (
                  <Flag className="h-5 w-5 text-primary" />
                ) : (
                  <Star className="h-5 w-5 text-warning" />
                )}
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  <p className="font-medium">{milestone.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {milestone.date.toLocaleDateString()}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </g>
        ))}
      </g>
    </TooltipProvider>
  )
}
