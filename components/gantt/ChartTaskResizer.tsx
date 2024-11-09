import { useState, useRef } from 'react'
import { Task } from "@/types/task"
import { cn } from "@/lib/utils"
import { differenceInDays, addDays } from "date-fns"

interface ChartTaskResizerProps {
  task: Task
  startDate: Date
  dimensions: {
    LABEL_WIDTH: number
    ROW_HEIGHT: number
    HEADER_HEIGHT: number
    DAY_WIDTH: number
  }
  onResize: (taskId: string, newStartDate: Date, newEndDate: Date) => void
  minTaskDuration?: number
  maxTaskDuration?: number
}

export function ChartTaskResizer({
  task,
  startDate,
  dimensions,
  onResize,
  minTaskDuration = 1,
  maxTaskDuration = 90
}: ChartTaskResizerProps) {
  const [isResizing, setIsResizing] = useState<'start' | 'end' | null>(null)
  const initialMousePos = useRef<number>(0)
  const initialDates = useRef<{ start: Date; end: Date }>({ start: task.startDate, end: task.endDate })

  const handleMouseDown = (e: React.MouseEvent, type: 'start' | 'end') => {
    e.stopPropagation()
    setIsResizing(type)
    initialMousePos.current = e.clientX
    initialDates.current = { start: task.startDate, end: task.endDate }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return

    const deltaX = e.clientX - initialMousePos.current
    const daysDelta = Math.round(deltaX / dimensions.DAY_WIDTH)

    let newStartDate = initialDates.current.start
    let newEndDate = initialDates.current.end

    if (isResizing === 'start') {
      newStartDate = addDays(initialDates.current.start, daysDelta)
    } else {
      newEndDate = addDays(initialDates.current.end, daysDelta)
    }

    const duration = differenceInDays(newEndDate, newStartDate)
    
    if (duration >= minTaskDuration && duration <= maxTaskDuration) {
      onResize(task.id, newStartDate, newEndDate)
    }
  }

  const handleMouseUp = () => {
    setIsResizing(null)
  }

  return (
    <>
      {/* Left resize handle */}
      <div
        className={cn(
          "absolute top-0 left-0 w-2 h-full cursor-ew-resize",
          "hover:bg-primary/50"
        )}
        onMouseDown={(e) => handleMouseDown(e, 'start')}
      />

      {/* Right resize handle */}
      <div
        className={cn(
          "absolute top-0 right-0 w-2 h-full cursor-ew-resize",
          "hover:bg-primary/50"
        )}
        onMouseDown={(e) => handleMouseDown(e, 'end')}
      />

      {isResizing && (
        <div
          className="fixed inset-0 cursor-ew-resize"
          onMouseMove={(e) => handleMouseMove(e as unknown as MouseEvent)}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      )}
    </>
  )
}
