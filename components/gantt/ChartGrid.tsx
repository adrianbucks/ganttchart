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
			  const headerWidth = dates.filter((d, idx) => idx >= i && getTopLevelHeader(d) === headerText).length * dimensions.DAY_WIDTH
			  acc.push(
				<text
				  key={`top-${i}`}
				  x={dimensions.LABEL_WIDTH + i * dimensions.DAY_WIDTH + headerWidth / 2}
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
			  x={dimensions.LABEL_WIDTH + i * dimensions.DAY_WIDTH + dimensions.DAY_WIDTH / 2}
			  y="50"
			  textAnchor="middle"
			  className={cn(
				'fill-muted-foreground',
				customColors?.today && isToday(date) && customColors.today,
				showWeekends && customColors?.weekend && isWeekend(date) && customColors.weekend
			  )}
			>
			  {getBottomLevelHeader(date)}
			</text>
		  ))}
	
		  {dates.map((_, i) => (
			<line
			  key={`grid-${i}`}
			  x1={dimensions.LABEL_WIDTH + i * dimensions.DAY_WIDTH}
			  y1={dimensions.HEADER_HEIGHT}
			  x2={dimensions.LABEL_WIDTH + i * dimensions.DAY_WIDTH}
			  y2={dimensions.CHART_HEIGHT}
			  className={cn(
				'stroke-muted-foreground/20',
				customColors?.grid && customColors.grid,
				showWeekends && customColors?.weekend && isWeekend(dates[i]) && customColors.weekend,
				customColors?.today && isToday(dates[i]) && customColors.today
			  )}
			  strokeWidth="1"
			/>
		  ))}
		</g>
	  )
  }
