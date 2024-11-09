import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface ChartDateIndicatorProps {
  dimensions: {
    LABEL_WIDTH: number
    CHART_HEIGHT: number
    HEADER_HEIGHT: number
    DAY_WIDTH: number
  }
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
  const { LABEL_WIDTH, CHART_HEIGHT, HEADER_HEIGHT, DAY_WIDTH } = dimensions

  useEffect(() => {
    if (!showCurrentTime) return

    const interval = setInterval(() => {
      setNow(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [showCurrentTime])

  const getXPosition = (date: Date) => {
    const diffTime = Math.abs(date.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return LABEL_WIDTH + (diffDays * DAY_WIDTH)
  }

  const xPosition = getXPosition(now)

  // Don't render if current date is outside the visible range
  if (xPosition < LABEL_WIDTH) return null

  return (
    <g className="chart-date-indicator">
      {/* Vertical line */}
      <line
        x1={xPosition}
        y1={HEADER_HEIGHT}
        x2={xPosition}
        y2={CHART_HEIGHT}
        className={cn(
          "stroke-primary stroke-[2px] stroke-dasharray-2",
          customColors?.line
        )}
      />

      {/* Date label */}
      <foreignObject
        x={xPosition - 50}
        y={HEADER_HEIGHT - 20}
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
