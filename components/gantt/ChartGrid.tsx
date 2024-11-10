import { isWeekend, isToday } from 'date-fns'
import { cn } from '@/lib/utils'
import { ChartDimensions } from '@/lib/visualization-utils'

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
	showWeekends = true,
	customColors
  }: ChartGridProps) {
	return (
	  <div 
		className="absolute top-0 left-0"
		style={{ 
		  marginLeft: dimensions.LABEL_WIDTH,
		  height: dimensions.CHART_HEIGHT 
		}}
	  >
		{dates.map((date, index) => {
		  const isWEEKEND = isWeekend(date)
		  const isTODAY = isToday(date)
		  
		  return (
			<div
			  key={date.toISOString()}
			  className={cn(
				"absolute top-0 h-full border-r border-border",
				isWEEKEND && showWeekends && "bg-muted/50",
				isTODAY && "bg-primary/10"
			  )}
			  style={{
				left: index * dimensions.DAY_WIDTH,
				width: dimensions.DAY_WIDTH,
				backgroundColor: isTODAY 
				  ? customColors?.today 
				  : isWEEKEND && showWeekends 
					? customColors?.weekend 
					: customColors?.grid
			  }}
			/>
		  )
		})}
	  </div>
	)
  }
