import { useRef, useState, useEffect } from 'react'
import { cn } from "@/lib/utils"

interface ChartScrollContainerProps {
  width: number
  height: number
  children: React.ReactNode
  onScroll?: (scrollLeft: number, scrollTop: number) => void
  className?: string
}

export function ChartScrollContainer({
  width,
  height,
  children,
  onScroll,
  className
}: ChartScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      if (e.shiftKey) {
        e.preventDefault()
        container.scrollLeft += e.deltaY
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.pageX - containerRef.current!.offsetLeft)
    setScrollLeft(containerRef.current!.scrollLeft)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    
    const x = e.pageX - containerRef.current!.offsetLeft
    const walk = (x - startX) * 2
    containerRef.current!.scrollLeft = scrollLeft - walk
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "overflow-auto relative",
        isDragging && "cursor-grabbing select-none",
        className
      )}
      style={{
        width,
        height,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onScroll={(e) => onScroll?.(e.currentTarget.scrollLeft, e.currentTarget.scrollTop)}
    >
      {children}
    </div>
  )
}
