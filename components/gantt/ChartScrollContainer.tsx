import { cn } from '@/lib/utils'
import { useRef, useState } from 'react'
import { ChartDimensions } from '@/lib/visualization-utils'

interface ChartScrollContainerProps {
	children: React.ReactNode
	onScroll?: (scrollLeft: number, scrollTop: number) => void
	className?: string
	dimensions: ChartDimensions
  }

  export function ChartScrollContainer({
	children,
	onScroll,
	className,
	dimensions
  }: ChartScrollContainerProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	const [isDragging, setIsDragging] = useState(false)
	const [startX, setStartX] = useState(0)
	const [startY, setStartY] = useState(0)
	const [scrollLeft, setScrollLeft] = useState(0)
	const [scrollTop, setScrollTop] = useState(0)
  
	const handleWheel = (e: React.WheelEvent) => {
	  if (!containerRef.current) return
  
	  if (e.ctrlKey) {
		containerRef.current.scrollLeft += e.deltaY
	  } else {
		containerRef.current.scrollTop += e.deltaY
	  }
	}
  
	const handleMouseDown = (e: React.MouseEvent) => {
	  setIsDragging(true)
	  setStartX(e.pageX - containerRef.current!.offsetLeft)
	  setStartY(e.pageY - containerRef.current!.offsetTop)
	  setScrollLeft(containerRef.current!.scrollLeft)
	  setScrollTop(containerRef.current!.scrollTop)
	}
  
	const handleMouseMove = (e: React.MouseEvent) => {
	  if (!isDragging) return
  
	  e.preventDefault()
	  const x = e.pageX - containerRef.current!.offsetLeft
	  const y = e.pageY - containerRef.current!.offsetTop
	  const walkX = (x - startX)
	  const walkY = (y - startY)
  
	  containerRef.current!.scrollLeft = scrollLeft - walkX
	  containerRef.current!.scrollTop = scrollTop - walkY
	}
  
	const handleMouseUp = () => {
	  setIsDragging(false)
	}
  
	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
	  const target = e.target as HTMLDivElement
	  onScroll?.(target.scrollLeft, target.scrollTop)
	}
  
	return (
	  <div 
		ref={containerRef}
		className={cn(
		  "relative overflow-auto border rounded-md bg-background cursor-grab active:cursor-grabbing",
		  isDragging && "select-none",
		  className
		)}
		style={{
			height: dimensions.CHART_HEIGHT,
			maxHeight: '80vh',
			width: '100%',
		}}
		onWheel={handleWheel}
		onMouseDown={handleMouseDown}
		onMouseMove={handleMouseMove}
		onMouseUp={handleMouseUp}
		onMouseLeave={handleMouseUp}
		onScroll={handleScroll}
	  >
		{children}
	  </div>
	)
  }
  
  
  
  
