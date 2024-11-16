import { format } from 'date-fns'
import { ChartDimensions } from '@/lib/visualization-utils'

interface ChartHeaderProps {
	dates: Date[]
	dimensions: ChartDimensions
	granularity: 'day' | 'week' | 'month'
  }

  export function ChartHeader({ dates, dimensions, granularity }: ChartHeaderProps) {
	return (
	  <div 
		className="absolute top-0 left-0 border-b border-border bg-background"
		style={{ height: dimensions.HEADER_HEIGHT }}
	  >
		<div className="flex" style={{ marginLeft: dimensions.LABEL_WIDTH }}>
		  {dates.map((date, index) => (
			<div
				key={`header-${index}-${date.getTime()}`}
			  className="flex-shrink-0 border-r border-border px-2 py-1 text-sm"
			  style={{ width: dimensions.DAY_WIDTH }}
			>
			  {format(date, granularity === 'day' ? 'MMM d' : 'MMM yyyy')}
			</div>
		  ))}
		</div>
	  </div>
	)
  }
