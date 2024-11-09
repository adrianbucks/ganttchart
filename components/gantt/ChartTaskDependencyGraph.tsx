import { Task } from "@/types/task"
import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"

interface ChartTaskDependencyGraphProps {
  tasks: Task[]
  width: number
  height: number
  className?: string
}

export function ChartTaskDependencyGraph({
  tasks,
  width,
  height,
  className
}: ChartTaskDependencyGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Calculate node positions
    const nodes = calculateNodePositions(tasks, width, height)

    // Draw connections
    tasks.forEach(task => {
      if (!task.dependencies) return

      task.dependencies.forEach(depId => {
        const fromNode = nodes.find(n => n.id === depId)
        const toNode = nodes.find(n => n.id === task.id)
        if (!fromNode || !toNode) return

        drawConnection(ctx, fromNode, toNode)
      })
    })

    // Draw nodes
    nodes.forEach(node => {
      drawNode(ctx, node)
    })
  }, [tasks, width, height])

  return (
    <div className={cn("relative", className)}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border rounded-lg"
      />
    </div>
  )
}

interface Node {
  id: string
  x: number
  y: number
  name: string
  progress: number
}

function calculateNodePositions(tasks: Task[], width: number, height: number): Node[] {
  const padding = 50
  const availableWidth = width - (padding * 2)
  const availableHeight = height - (padding * 2)
  
  return tasks.map((task, index) => ({
    id: task.id,
    x: padding + (index % 3) * (availableWidth / 2),
    y: padding + Math.floor(index / 3) * (availableHeight / 3),
    name: task.name,
    progress: task.progress
  }))
}

function drawConnection(ctx: CanvasContext2D, from: Node, to: Node) {
  ctx.beginPath()
  ctx.moveTo(from.x, from.y)
  ctx.lineTo(to.x, to.y)
  ctx.strokeStyle = 'hsl(var(--muted-foreground))'
  ctx.stroke()
}

function drawNode(ctx: CanvasContext2D, node: Node) {
  // Draw circle
  ctx.beginPath()
  ctx.arc(node.x, node.y, 30, 0, Math.PI * 2)
  ctx.fillStyle = 'hsl(var(--background))'
  ctx.fill()
  ctx.strokeStyle = 'hsl(var(--primary))'
  ctx.stroke()

  // Draw text
  ctx.fillStyle = 'hsl(var(--foreground))'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '12px sans-serif'
  ctx.fillText(node.name, node.x, node.y)
}
