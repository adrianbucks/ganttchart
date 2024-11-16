import { isWeekend, isToday } from 'date-fns'
import { cn } from '@/lib/utils'
import { ChartDimensions } from '@/lib/visualization-utils'
import { format, getWeek } from 'date-fns'

interface ChartGridProps {
  dates: Date[]
  dimensions: ChartDimensions
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
  const getTopLevelHeader = (date: Date) => {
    switch (granularity) {
      case 'day':
        return format(date, 'MMMM yyyy')
      case 'week':
        return format(date, 'MMMM yyyy')
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
        return `W ${getWeek(date)}`
      case 'month':
        return format(date, 'MMM')
      default:
        return ''
    }
  }

  const shouldDrawGridLine = (index: number) => {
    switch (granularity) {
      case 'day':
        return true
      case 'week':
        return index % 7 === 0
      case 'month':
        return index % 30 === 0
      default:
        return true
    }
  }

  return (
    <g className="text-sm">
      {dates.reduce((acc, date, i) => {
        if (shouldDrawGridLine(i)) {
          const headerText = getTopLevelHeader(date)
          const prevHeaderText = i > 0 ? getTopLevelHeader(dates[i - 1]) : ''
          
          if (headerText !== prevHeaderText || i === 0) {
            const headerWidth = dates.filter((d, idx) => 
              idx >= i && 
              getTopLevelHeader(d) === headerText && 
              shouldDrawGridLine(idx)
            ).length * dimensions.DAY_WIDTH
            
            acc.push(
              <text
			  	key={`header-top-${date.getTime()}-${i}`}
                x={dimensions.LABEL_WIDTH + i * dimensions.DAY_WIDTH + headerWidth / 2}
                y="30"
                textAnchor="middle"
                className="fill-muted-foreground font-medium"
              >
                {headerText}
              </text>
            )
          }
        }
        return acc
      }, [] as JSX.Element[])}

{dates.reduce((acc, date, i) => {
  if (shouldDrawGridLine(i)) {
    const multiplier = granularity === 'month' ? 30 : granularity === 'week' ? 7 : 1
    const headerText = getBottomLevelHeader(date)
    const prevHeaderText = i > 0 ? getBottomLevelHeader(dates[i - 1]) : ''
    const xAdjuster = Math.floor(i / multiplier)
    
    if (headerText !== prevHeaderText || i === 0) {
      const headerWidth = dates.filter((d, idx) => 
        idx >= i && 
        getBottomLevelHeader(d) === headerText && 
        shouldDrawGridLine(idx)
      ).length * dimensions.DAY_WIDTH
      
      acc.push(
        <text
          key={`header-bottom-${date.getTime()}-${i}`}
          x={dimensions.LABEL_WIDTH + xAdjuster * dimensions.DAY_WIDTH + headerWidth / 2}
          y="50"
          textAnchor="middle"
          className={cn(
            'fill-muted-foreground',
            customColors?.today && isToday(date) && customColors.today,
            showWeekends && customColors?.weekend && isWeekend(date) && customColors.weekend
          )}
        >
          {headerText}
        </text>
      )
    }
  }
  return acc
}, [] as JSX.Element[])}


      {dates.map((date, i) => (
        shouldDrawGridLine(i) && (
          <line
		  	key={`grid-line-${date.getTime()}-${i}`}
            x1={dimensions.LABEL_WIDTH + i * dimensions.DAY_WIDTH}
            y1={dimensions.HEADER_HEIGHT}
            x2={dimensions.LABEL_WIDTH + i * dimensions.DAY_WIDTH}
            y2={dimensions.CHART_HEIGHT}
            className={cn(
              'stroke-muted-foreground/20',
              customColors?.grid && customColors.grid,
              showWeekends && customColors?.weekend && isWeekend(date) && customColors.weekend,
              customColors?.today && isToday(date) && customColors.today
            )}
            strokeWidth="1"
          />
        )
      ))}
    </g>
  )
}
