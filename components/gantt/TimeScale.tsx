'use client'

interface TimeScaleProps {
	totalDuration: number
	startDate: number
	taskHeight: number
	dayWidth: number
	tasksCount: number
}

export function TimeScale({
	totalDuration,
	startDate,
	taskHeight,
	dayWidth,
	tasksCount,
}: TimeScaleProps) {
	const dates = Array.from({ length: totalDuration }, (_, i) => {
		const date = new Date(startDate + i * 24 * 60 * 60 * 1000)
		return {
			day: date.getDate(),
			month: date.toLocaleString('default', { month: 'short' }),
			isFirstOfMonth: date.getDate() === 1,
		}
	})

	return (
		<>
			{/* Month labels */}
			{dates.map(
				(date, i) =>
					date.isFirstOfMonth && (
						<text
							key={`month-${i}`}
							x={i * dayWidth}
							y="25"
							textAnchor="start"
							className="text-xs fill-muted-foreground"
						>
							{date.month}
						</text>
					)
			)}

			{/* Date labels */}
			{dates.map((date, i) => (
				<text
					key={`date-${i}`}
					x={i * dayWidth}
					y="45"
					textAnchor="middle"
					className="text-xs fill-muted-foreground"
				>
					{date.day}
				</text>
			))}

			{/* Grid lines */}
			{dates.map((_, i) => (
				<line
					key={i}
					x1={i * dayWidth}
					y1="60"
					x2={i * dayWidth}
					y2={tasksCount * taskHeight + 60}
					className="stroke-border"
					strokeWidth="1"
				/>
			))}
		</>
	)
}
