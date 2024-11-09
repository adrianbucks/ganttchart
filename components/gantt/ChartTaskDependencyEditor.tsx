import { useState, useRef } from 'react'
import { Task } from "@/types/task"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Link2, X } from "lucide-react"

interface ChartTaskDependencyEditorProps {
  tasks: Task[]
  dimensions: {
    LABEL_WIDTH: number
    ROW_HEIGHT: number
    HEADER_HEIGHT: number
    DAY_WIDTH: number
  }
  onAddDependency: (fromTaskId: string, toTaskId: string) => void
  onRemoveDependency: (fromTaskId: string, toTaskId: string) => void
}

export function ChartTaskDependencyEditor({
  tasks,
  dimensions,
  onAddDependency,
  onRemoveDependency
}: ChartTaskDependencyEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [tempLine, setTempLine] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const handleTaskClick = (taskId: string) => {
    if (!isEditing) return

    if (!selectedTaskId) {
      setSelectedTaskId(taskId)
    } else if (selectedTaskId !== taskId) {
      onAddDependency(selectedTaskId, taskId)
      setSelectedTaskId(null)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!selectedTaskId || !svgRef.current) return

    const selectedTask = tasks.find(t => t.id === selectedTaskId)
    if (!selectedTask) return

    const point = svgRef.current.createSVGPoint()
    point.x = e.clientX
    point.y = e.clientY
    const cursorPoint = point.matrixTransform(svgRef.current.getScreenCTM()?.inverse())

    setTempLine({
      x1: dimensions.LABEL_WIDTH + selectedTask.order * dimensions.DAY_WIDTH,
      y1: dimensions.HEADER_HEIGHT + selectedTask.order * dimensions.ROW_HEIGHT + dimensions.ROW_HEIGHT / 2,
      x2: cursorPoint.x,
      y2: cursorPoint.y
    })
  }

  return (
    <>
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          variant={isEditing ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setIsEditing(!isEditing)
            setSelectedTaskId(null)
            setTempLine(null)
          }}
        >
          <Link2 className="h-4 w-4 mr-2" />
          {isEditing ? "Done" : "Edit Dependencies"}
        </Button>
      </div>

      {isEditing && (
        <svg
          ref={svgRef}
          className="absolute inset-0 pointer-events-none"
          onMouseMove={handleMouseMove}
        >
          {tempLine && (
            <line
              {...tempLine}
              className="stroke-primary stroke-[2px] stroke-dasharray-2"
            />
          )}
        </svg>
      )}

      {tasks.map(task => (
        <div
          key={task.id}
          className={cn(
            "absolute",
            isEditing && "cursor-pointer hover:bg-primary/10"
          )}
          style={{
            left: dimensions.LABEL_WIDTH,
            top: dimensions.HEADER_HEIGHT + task.order * dimensions.ROW_HEIGHT,
            width: dimensions.DAY_WIDTH,
            height: dimensions.ROW_HEIGHT
          }}
          onClick={() => handleTaskClick(task.id)}
        />
      ))}
    </>
  )
}
