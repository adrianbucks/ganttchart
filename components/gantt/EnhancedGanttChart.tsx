"use client"

import { format, addDays, differenceInDays, getWeek } from "date-fns"
import { useState, useMemo, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Task } from "@/types/task"

interface GanttChartProps {
  projectName?: string
  tasks?: Task[]
  startDate?: Date
  endDate?: Date
  showTaskLabels?: boolean
  className?: string
  granularity?: 'day' | 'week' | 'month'
}

const useGanttChart = (props: GanttChartProps) => {
  const {
    tasks: propTasks,
    startDate: propStartDate = new Date(2024, 0, 1),
    endDate: propEndDate = new Date(2024, 2, 15),
    granularity = 'day',
  } = props

  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [arrowStyle, setArrowStyle] = useState<'curved' | 'squared'>('curved')

  const tasks = useMemo(() => {
    if (propTasks && propTasks.length > 0) {
      return propTasks
    }
    return generateDummyData(propStartDate, propEndDate)
  }, [propTasks, propStartDate, propEndDate])

  const CHART_HEIGHT = 500
  const HEADER_HEIGHT = 80
  const ROW_HEIGHT = 40
  const LABEL_WIDTH = 200
  const DAY_WIDTH = granularity === 'day' ? 40 : granularity === 'week' ? 100 : 200

  const totalDays = differenceInDays(propEndDate, propStartDate) + 1
  const CHART_WIDTH = LABEL_WIDTH + totalDays * DAY_WIDTH

  const dates = useMemo(() => Array.from({ length: totalDays }, (_, i) => addDays(propStartDate, i)), [propStartDate, totalDays])

  const getXFromDate = (date: Date) => {
    const days = differenceInDays(date, propStartDate)
    return LABEL_WIDTH + days * DAY_WIDTH
  }

  return {
    hoveredTaskId,
    setHoveredTaskId,
    selectedTaskId,
    setSelectedTaskId,
    arrowStyle,
    setArrowStyle,
    tasks,
    dates,
    CHART_HEIGHT,
    HEADER_HEIGHT,
    ROW_HEIGHT,
    LABEL_WIDTH,
    DAY_WIDTH,
    CHART_WIDTH,
    getXFromDate,
    granularity,
  }
}

const GanttHeader: React.FC<{
  projectName: string
  arrowStyle: 'curved' | 'squared'
  setArrowStyle: (style: 'curved' | 'squared') => void
}> = ({ projectName, arrowStyle, setArrowStyle }) => (
  <div className="flex justify-between items-center">
    <h2 className="text-2xl font-bold">{projectName}</h2>
    <div className="space-x-2">
      <Button
        onClick={() => setArrowStyle('curved')}
        variant={arrowStyle === 'curved' ? 'default' : 'outline'}
      >
        Curved Arrows
      </Button>
      <Button
        onClick={() => setArrowStyle('squared')}
        variant={arrowStyle === 'squared' ? 'default' : 'outline'}
      >
        Squared Arrows
      </Button>
    </div>
  </div>
)

const GanttGrid: React.FC<{
  dates: Date[]
  LABEL_WIDTH: number
  DAY_WIDTH: number
  HEADER_HEIGHT: number
  CHART_HEIGHT: number
  granularity: 'day' | 'week' | 'month'
}> = ({ dates, LABEL_WIDTH, DAY_WIDTH, HEADER_HEIGHT, CHART_HEIGHT, granularity }) => {
  const getTopLevelHeader = (date: Date) => {
    switch (granularity) {
      case 'day':
        return format(date, 'MMMM yyyy')
      case 'week':
        return `Week ${getWeek(date)}, ${format(date, 'yyyy')}`
      case 'month':
        return format(date, 'yyyy')
      default:
        return ''
    }
  }

  const getBottomLevelHeader = (date: Date) => {
    switch (granularity) {
      case 'day':
        return format(date, 'd')
      case 'week':
        return format(date, 'MMM d')
      case 'month':
        return format(date, 'MMM')
      default:
        return ''
    }
  }

  return (
    <g className="text-sm">
      {dates.reduce((acc, date, i) => {
        const headerText = getTopLevelHeader(date)
        const prevHeaderText = i > 0 ? getTopLevelHeader(dates[i - 1]) : ''
        if (headerText !== prevHeaderText || i === 0) {
          const headerWidth = dates.filter((d, idx) => idx >= i && getTopLevelHeader(d) === headerText).length * DAY_WIDTH
          acc.push(
            <text
              key={`top-${i}`}
              x={LABEL_WIDTH + i * DAY_WIDTH + headerWidth / 2}
              y="30"
              textAnchor="middle"
              className="fill-muted-foreground font-medium"
            >
              {headerText}
            </text>
          )
        }
        return acc
      }, [] as JSX.Element[])}

      {dates.map((date, i) => (
        <text
          key={`bottom-${i}`}
          x={LABEL_WIDTH + i * DAY_WIDTH + DAY_WIDTH / 2}
          y="50"
          textAnchor="middle"
          className="fill-muted-foreground"
        >
          {getBottomLevelHeader(date)}
        </text>
      ))}

      {dates.map((_, i) => (
        <line
          key={`grid-${i}`}
          x1={LABEL_WIDTH + i * DAY_WIDTH}
          y1={HEADER_HEIGHT}
          x2={LABEL_WIDTH + i * DAY_WIDTH}
          y2={CHART_HEIGHT}
          className="stroke-muted-foreground/20"
          strokeWidth="1"
        />
      ))}
    </g>
  )
}

const GanttTask: React.FC<{
  task: Task
  index: number
  HEADER_HEIGHT: number
  ROW_HEIGHT: number
  LABEL_WIDTH: number
  getXFromDate: (date: Date) => number
  showTaskLabels: boolean
  isHovered: boolean
  isSelected: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  onClick: () => void
}> = ({
  task,
  index,
  HEADER_HEIGHT,
  ROW_HEIGHT,
  LABEL_WIDTH,
  getXFromDate,
  showTaskLabels,
  isHovered,
  isSelected,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) => {
  const taskStart = getXFromDate(task.startDate)
  const taskEnd = getXFromDate(task.endDate)
  const taskWidth = taskEnd - taskStart
  const y = HEADER_HEIGHT + index * ROW_HEIGHT

  return (
    <g
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {showTaskLabels && (
        <text
          x={LABEL_WIDTH - 8}
          y={y + ROW_HEIGHT / 2}
          className={cn(
            "fill-foreground",
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
            <rect
              x={taskStart}
              y={y + ROW_HEIGHT / 4}
              width={taskWidth}
              height={ROW_HEIGHT / 2}
              rx={4}
              className={cn(
                "fill-muted transition-colors",
                isHovered && "fill-muted/80",
                isSelected && "stroke-primary stroke-2"
              )}
            />

            <rect
              x={taskStart}
              y={y + ROW_HEIGHT / 4}
              width={taskWidth * (task.progress / 100)}
              height={ROW_HEIGHT / 2}
              rx={4}
              fill={task.color || "hsl(var(--primary))"}
              className={cn(
                "transition-colors",
                isHovered && "opacity-80"
              )}
            />

            {task.slack && task.slack > 0 && (
              <rect
                x={taskEnd}
                y={y + ROW_HEIGHT / 4}
                width={task.slack * (taskEnd - taskStart) / differenceInDays(task.endDate, task.startDate)}
                height={ROW_HEIGHT / 2}
                rx={4}
                className="fill-primary/20"
                strokeDasharray="4 4"
              />
            )}
          </g>
        </TooltipTrigger>
        <TooltipContent>
          <p>{task.name}</p>
          <p>Progress: {task.progress}%</p>
          <p>Start: {format(task.startDate, 'MMM d, yyyy')}</p>
          <p>End: {format(task.endDate, 'MMM d, yyyy')}</p>
        </TooltipContent>
      </Tooltip>
    </g>
  )
}

const GanttDependency: React.FC<{
  fromTask: Task
  toTask: Task
  tasks: Task[]
  HEADER_HEIGHT: number
  ROW_HEIGHT: number
  getXFromDate: (date: Date) => number
  arrowStyle: 'curved' | 'squared'
  isHovered: boolean
}> = ({ fromTask, toTask, tasks, HEADER_HEIGHT, ROW_HEIGHT, getXFromDate, arrowStyle, isHovered }) => {
  const getDependencyPath = (fromTask: Task, toTask: Task) => {
    const fromX = getXFromDate(fromTask.endDate)
    const fromY = tasks.indexOf(fromTask) * ROW_HEIGHT + HEADER_HEIGHT + ROW_HEIGHT / 2
    const toX = getXFromDate(toTask.startDate)
    const toY = tasks.indexOf(toTask) * ROW_HEIGHT + HEADER_HEIGHT + ROW_HEIGHT / 2
    
    if (arrowStyle === 'curved') {
      const midX = (fromX + toX) / 2
      return `M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`
    } else {
      const midY = (fromY + toY) / 2
      return `M ${fromX} ${fromY} H ${fromX + 10} V ${midY} H ${toX - 10} V ${toY} H ${toX}`
    }
  }

  return (
    <path
      d={getDependencyPath(fromTask, toTask)}
      className={cn(
        "fill-none stroke-muted-foreground",
        isHovered ? "stroke-primary stroke-2" : "stroke-1"
      )}
      markerEnd="url(#arrowhead)"
    />
  )
}

const generateDummyData = (startDate: Date, endDate: Date): Task[] => {
  const tasks: Task[] = [
    {
      id: "task-1",
      name: "Project Initiation",
      startDate: startDate,
      endDate: addDays(startDate, 5),
      progress: 100,
      color: "hsl(var(--primary))"
    },
    {
      id: "task-2",
      name: "Requirements Gathering",
      startDate: addDays(startDate, 3),
      endDate: addDays(startDate, 10),
      progress: 80,
      dependencies: ["task-1"],
      color: "hsl(var(--secondary))"
    },
    {
      id: "task-3",
      name: "Design Phase",
      startDate: addDays(startDate, 11),
      endDate: addDays(startDate, 20),
      progress: 60,
      dependencies: ["task-2"],
      slack: 2,
      color: "hsl(var(--accent))"
    },
    {
      id: "task-4",
      name: "Development",
      startDate: addDays(startDate, 21),
      endDate: addDays(startDate, 40),
      progress: 30,
      dependencies: ["task-3"],
      color: "hsl(var(--destructive))"
    },
    {
      id: "task-5",
      name: "Testing",
      startDate: addDays(startDate, 35),
      endDate: endDate,
      progress: 10,
      dependencies: ["task-4"],
      color: "hsl(var(--warning))"
    }
  ]
  return tasks
}

export default function GanttChart({
  projectName = "Enhanced Project Timeline",
  tasks: propTasks,
  startDate: propStartDate = new Date(2024, 0, 1),
  endDate: propEndDate = new Date(2024, 2, 15),
  showTaskLabels = true,
  className,
  granularity = 'day',
}: GanttChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const {
    hoveredTaskId,
    setHoveredTaskId,
    selectedTaskId,
    setSelectedTaskId,
    arrowStyle,
    setArrowStyle,
    tasks,
    dates,
    CHART_HEIGHT,
    HEADER_HEIGHT,
    ROW_HEIGHT,
    LABEL_WIDTH,
    DAY_WIDTH,
    CHART_WIDTH,
    getXFromDate,
  } = useGanttChart({ tasks: propTasks, startDate: propStartDate, endDate: propEndDate, granularity })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chartRef.current && !chartRef.current.contains(event.target as Node)) {
        setSelectedTaskId(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [setSelectedTaskId])

  return (
    <TooltipProvider>
      <div className={cn("space-y-4", className)}>
        <GanttHeader projectName={projectName} arrowStyle={arrowStyle} setArrowStyle={setArrowStyle} />
        <div ref={chartRef} className="overflow-x-auto bg-background border rounded-lg">
          <svg
            width={CHART_WIDTH}
            height={CHART_HEIGHT}
            className="font-sans"
          >
            <GanttGrid
              dates={dates}
              LABEL_WIDTH={LABEL_WIDTH}
              DAY_WIDTH={DAY_WIDTH}
              HEADER_HEIGHT={HEADER_HEIGHT}
              CHART_HEIGHT={CHART_HEIGHT}
              granularity={granularity}
            />

            {tasks.map((task, index) => (
              <GanttTask
                key={task.id}
                task={task}
                index={index}
                HEADER_HEIGHT={HEADER_HEIGHT}
                ROW_HEIGHT={ROW_HEIGHT}
                LABEL_WIDTH={LABEL_WIDTH}
                getXFromDate={getXFromDate}
                showTaskLabels={showTaskLabels}
                isHovered={hoveredTaskId === task.id}
                isSelected={selectedTaskId === task.id}
                onMouseEnter={() => setHoveredTaskId(task.id)}
                onMouseLeave={() => setHoveredTaskId(null)}
                onClick={() => setSelectedTaskId(task.id)}
              />
            ))}

            {tasks.map((task) =>
              task.dependencies?.map((depId) => {
                const fromTask = tasks.find((t) => t.id === depId)
                if (!fromTask) return null

                return (
                  <GanttDependency
                    key={`${depId}-${task.id}`}
                    fromTask={fromTask}
                    toTask={task}
                    tasks={tasks}
                    HEADER_HEIGHT={HEADER_HEIGHT}
                    ROW_HEIGHT={ROW_HEIGHT}
                    getXFromDate={getXFromDate}
                    arrowStyle={arrowStyle}
                    isHovered={hoveredTaskId === task.id || hoveredTaskId === depId}
                  />
                )
              })
            )}

            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  className="fill-muted-foreground"
                />
              </marker>
            </defs>
          </svg>
        </div>
      </div>
    </TooltipProvider>
  )
}