import { Button } from "@/components/ui/button"
import { Minus, Plus, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface ZoomControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
  className?: string
  disabled?: {
    zoomIn?: boolean
    zoomOut?: boolean
    reset?: boolean
  }
}

export function ZoomControls({
  onZoomIn,
  onZoomOut,
  onReset,
  className,
  disabled
}: ZoomControlsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomIn}
        disabled={disabled?.zoomIn}
        className="h-8 w-8"
      >
        <Plus className="h-4 w-4" />
        <span className="sr-only">Zoom In</span>
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={onZoomOut}
        disabled={disabled?.zoomOut}
        className="h-8 w-8"
      >
        <Minus className="h-4 w-4" />
        <span className="sr-only">Zoom Out</span>
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={onReset}
        disabled={disabled?.reset}
        className="h-8 w-8"
      >
        <RotateCcw className="h-4 w-4" />
        <span className="sr-only">Reset Zoom</span>
      </Button>
    </div>
  )
}
