import { useState, useRef, useEffect } from 'react'
import { cn } from "@/lib/utils"
import { Task } from "@/types/task"

interface ChartDragSelectProps {
  tasks: Task[]
  dimensions: {
    LABEL_WIDTH: number
    ROW_HEIGHT: number
    HEADER_HEIGHT: number
    CHART_WIDTH: number
    CHART_HEIGHT: number
  }
  onSelectionChange: (selectedTasks: Task[]) => void
  className?: string
}

export function ChartDragSelect({
  tasks,
  dimensions,
  onSelectionChange,
  className
}: ChartDragSelectProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectionBox, setSelectionBox] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 })
  const containerRef = useRef<SVGGElement>(null)

  const getMousePosition = (e: React.MouseEvent) => {
    const CTM = containerRef.current?.getScreenCTM()
    if (!CTM) return { x: 0, y: 0 }

    return {
      x: (e.clientX - CTM.e) / CTM.a,
      y: (e.clientY - CTM.f) / CTM.d
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return // Left click only
    
    const point = getMousePosition(e)
    setStartPoint(point)
    setSelectionBox({ x: point.x, y: point.y, width: 0, height: 0 })
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const point = getMousePosition(e)
    
    setSelectionBox({
      x: Math.min(point.x, startPoint.x),
      y: Math.min(point.y, startPoint.y),
      width: Math.abs(point.x - startPoint.x),
      height: Math.abs(point.y - startPoint.y)
    })

    // Calculate which tasks are within selection
    const selectedTasks = tasks.filter(task => {
      const taskY = dimensions.HEADER_HEIGHT + (task.order * dimensions.ROW_HEIGHT)
      return (
        taskY >= selectionBox.y &&
        taskY <= selectionBox.y + selectionBox.height
      )
    })

    onSelectionChange(selectedTasks)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mouseup', handleMouseUp)
      return () => document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  return (
    <g
      ref={containerRef}
      className={cn("chart-drag-select", className)}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
    >
      {isDragging && (
        <rect
          x={selectionBox.x}
          y={selectionBox.y}
          width={selectionBox.width}
          height={selectionBox.height}
          className="fill-primary/20 stroke-primary stroke-[1px]"
          pointerEvents="none"
        />
      )}
    </g>
  )
}
