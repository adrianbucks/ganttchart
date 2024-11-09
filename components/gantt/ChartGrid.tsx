import { format, isWeekend } from "date-fns"
import { cn } from "@/lib/utils"

interface ChartGridProps {
  dates: Date[]
  dimensions: {
    LABEL_WIDTH: number
    DAY_WIDTH: number
    CHART_HEIGHT: number
    HEADER_HEIGHT: number
  }
  granularity: 'day' | 'week' | 'month'
  showWeekends?: boolean
  customColors?: {
    grid?: string
    weekend?: string
    today?: string
  }
}

export function ChartGrid({
  dates,
  dimensions,
  granularity,
  showWeekends = true,
  customColors
}: ChartGridProps) {
  const { LABEL_WIDTH, DAY_WIDTH, CHART_HEIGHT, HEADER_HEIGHT } = dimensions
  const today = new Date()

  return (
    <g className="chart-grid">
      {/* Vertical grid lines */}
      {dates.map((date, i) => {
        const x = LABEL_WIDTH + i * DAY_WIDTH
        const isWeekendDay = showWeekends && isWeekend(date)
        const isToday = format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')

        return (
          <g key={`grid-${i}`}>
            {/* Weekend highlight */}
            {isWeekendDay && (
              <rect
                x={x}
                y={HEADER_HEIGHT}
                width={DAY_WIDTH}
                height={CHART_HEIGHT - HEADER_HEIGHT}
                className={cn(
                  "fill-muted/10",
                  customColors?.weekend
                )}
              />
            )}

            {/* Grid line */}
            <line
              x1={x}
              y1={HEADER_HEIGHT}
              x2={x}
              y2={CHART_HEIGHT}
              className={cn(
                "stroke-muted-foreground/20",
                isToday && "stroke-primary/50 stroke-[1.5px]",
                customColors?.grid
              )}
            />

            {/* Today indicator */}
            {isToday && (
              <line
                x1={x}
                y1={HEADER_HEIGHT}
                x2={x}
                y2={CHART_HEIGHT}
                className={cn(
                  "stroke-primary stroke-[2px]",
                  customColors?.today
                )}
              />
            )}
          </g>
        )
      })}

      {/* Horizontal grid lines for task rows */}
      {Array.from({ length: Math.floor((CHART_HEIGHT - HEADER_HEIGHT) / 40) }).map((_, i) => (
        <line
          key={`row-${i}`}
          x1={LABEL_WIDTH}
          y1={HEADER_HEIGHT + (i + 1) * 40}
          x2={LABEL_WIDTH + dates.length * DAY_WIDTH}
          y2={HEADER_HEIGHT + (i + 1) * 40}
          className={cn(
            "stroke-muted-foreground/10",
            customColors?.grid
          )}
        />
      ))}
    </g>
  )
}
