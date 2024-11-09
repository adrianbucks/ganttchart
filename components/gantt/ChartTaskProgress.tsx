import { useState, useRef } from 'react'
import { Task } from "@/types/task"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"

interface ChartTaskProgressProps {
  task: Task
  dimensions: {
    LABEL_WIDTH: number
    ROW_HEIGHT: number
    DAY_WIDTH: number
  }
  onProgressChange: (taskId: string, newProgress: number) => void
  showSlider?: boolean
  customColors?: {
    progress?: string
    background?: string
  }
}

export function ChartTaskProgress({
  task,
  dimensions,
  onProgressChange,
  showSlider = true,
  customColors
}: ChartTaskProgressProps) {
  const [isEditing, setIsEditing] = useState(false)
  const progressBarRef = useRef<HTMLDivElement>(null)

  const handleProgressClick = (e: React.MouseEvent) => {
    if (!showSlider) return
    
    const rect = progressBarRef.current?.getBoundingClientRect()
    if (!rect) return

    const clickX = e.clientX - rect.left
    const percentage = Math.round((clickX / rect.width) * 100)
    const newProgress = Math.max(0, Math.min(100, percentage))
    
    onProgressChange(task.id, newProgress)
  }

  return (
    <div className="relative h-full">
      <div
        ref={progressBarRef}
        className={cn(
          "h-full rounded-sm cursor-pointer",
          customColors?.background || "bg-muted"
        )}
        onClick={handleProgressClick}
      >
        <div
          className={cn(
            "h-full rounded-sm transition-all",
            customColors?.progress || "bg-primary"
          )}
          style={{ width: `${task.progress}%` }}
        />
      </div>

      {showSlider && isEditing && (
        <div className="absolute inset-x-0 -bottom-6 px-2">
          <Slider
            value={[task.progress]}
            min={0}
            max={100}
            step={1}
            onValueChange={([value]) => onProgressChange(task.id, value)}
            onPointerUp={() => setIsEditing(false)}
          />
        </div>
      )}
    </div>
  )
}
