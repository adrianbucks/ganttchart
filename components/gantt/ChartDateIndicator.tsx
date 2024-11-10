import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { ChartDimensions, calculateDateXPosition } from "@/lib/visualization-utils"

interface ChartDateIndicatorProps {
  dimensions: ChartDimensions
  startDate: Date
  showCurrentTime?: boolean
  customColors?: {
    line?: string
    label?: string
  }
}

export function ChartDateIndicator({
  dimensions,
  startDate,
  showCurrentTime = true,
  customColors
}: ChartDateIndicatorProps) {
  const [now, setNow] = useState(new Date())
  
  useEffect(() => {
    if (!showCurrentTime) return

    const interval = setInterval(() => {
      setNow(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [showCurrentTime])

  const xPosition = calculateDateXPosition(now, startDate, dimensions)

  // Don't render if current date is outside the visible range
  if (xPosition < dimensions.LABEL_WIDTH) return null

  return (
    <g className="chart-date-indicator">
      <line
        x1={xPosition}
        y1={dimensions.HEADER_HEIGHT}
        x2={xPosition}
        y2={dimensions.CHART_HEIGHT}
        className={cn(
          "stroke-primary stroke-[2px] stroke-dasharray-2",
          customColors?.line
        )}
      />
      <foreignObject
        x={xPosition - 50}
        y={dimensions.HEADER_HEIGHT - 20}
        width={100}
        height={20}
      >
        <div className={cn(
          "text-xs text-primary text-center font-medium",
          customColors?.label
        )}>
          {format(now, "MMM d, HH:mm")}
        </div>
      </foreignObject>
    </g>
  )
}
