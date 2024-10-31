'use client'

interface DependencyArrowProps {
	depEndX: number
	depIndex: number
	startX: number
	index: number
	taskHeight: number
}

export function DependencyArrow({
	depEndX,
	depIndex,
	startX,
	index,
	taskHeight,
}: DependencyArrowProps) {
	return (
		<path
			d={`M ${depEndX} ${depIndex * taskHeight + 75}
         L ${depEndX + 10} ${depIndex * taskHeight + 75}
         L ${depEndX + 10} ${index * taskHeight + 75}
         L ${startX} ${index * taskHeight + 75}`}
			stroke="#94a3b8"
			fill="none"
			strokeDasharray="4"
		/>
	)
}
