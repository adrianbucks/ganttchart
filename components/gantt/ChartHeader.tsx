import { format, getWeek } from "date-fns"
import { cn } from "@/lib/utils"

interface ChartHeaderProps {
  dates: Date[]
  granularity: 'day' | 'week' | 'month'
  dimensions: {
    LABEL_WIDTH: number
    DAY_WIDTH: number
    HEADER_HEIGHT: number
  }
  className?: string
  customDateFormat?: {
    topLevel?: string
    bottomLevel?: string
  }
}

export function ChartHeader({
  dates,
  granularity,
  dimensions: { LABEL_WIDTH, DAY_WIDTH, HEADER_HEIGHT },
  className,
  customDateFormat
}: ChartHeaderProps) {
  const getTopLevelHeader = (date: Date) => {
    if (customDateFormat?.topLevel) {
      return format(date, customDateFormat.topLevel)
    }
    
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
    if (customDateFormat?.bottomLevel) {
      return format(date, customDateFormat.bottomLevel)
    }

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
    <g className={cn("text-sm", className)}>
      {/* Top Level Headers */}
      {dates.reduce((acc, date, i) => {
        const headerText = getTopLevelHeader(date)
        const prevHeaderText = i > 0 ? getTopLevelHeader(dates[i - 1]) : ''
        
        if (headerText !== prevHeaderText || i === 0) {
          const headerWidth = dates.filter(
            (d, idx) => idx >= i && getTopLevelHeader(d) === headerText
          ).length * DAY_WIDTH
          
          acc.push(
            <text
              key={`top-${i}`}
              x={LABEL_WIDTH + i * DAY_WIDTH + headerWidth / 2}
              y={HEADER_HEIGHT * 0.3}
              textAnchor="middle"
              className="fill-muted-foreground font-medium"
            >
              {headerText}
            </text>
          )
        }
        return acc
      }, [] as JSX.Element[])}

      {/* Bottom Level Headers */}
      {dates.map((date, i) => (
        <text
          key={`bottom-${i}`}
          x={LABEL_WIDTH + i * DAY_WIDTH + DAY_WIDTH / 2}
          y={HEADER_HEIGHT * 0.6}
          textAnchor="middle"
          className="fill-muted-foreground"
        >
          {getBottomLevelHeader(date)}
        </text>
      ))}

      {/* Grid Lines */}
      {dates.map((_, i) => (
        <line
          key={`grid-${i}`}
          x1={LABEL_WIDTH + i * DAY_WIDTH}
          y1={HEADER_HEIGHT}
          x2={LABEL_WIDTH + i * DAY_WIDTH}
          y2="100%"
          className="stroke-muted-foreground/20"
          strokeWidth="1"
        />
      ))}
    </g>
  )
}
