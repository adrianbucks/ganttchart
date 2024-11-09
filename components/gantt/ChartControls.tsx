import { Button } from "@/components/ui/button"
import { ZoomControls } from "./ZoomControls"
import { 
  ArrowsLeftRight, 
  Calendar, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react"

interface ChartControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
  onGranularityChange: (granularity: 'day' | 'week' | 'month') => void
  onArrowStyleToggle: () => void
  onTimeframeChange: (direction: 'prev' | 'next') => void
  granularity: 'day' | 'week' | 'month'
  arrowStyle: 'curved' | 'squared'
  zoomDisabled: {
    zoomIn?: boolean
    zoomOut?: boolean
    reset?: boolean
  }
  className?: string
}

export function ChartControls({
  onZoomIn,
  onZoomOut,
  onReset,
  onGranularityChange,
  onArrowStyleToggle,
  onTimeframeChange,
  granularity,
  arrowStyle,
  zoomDisabled,
  className
}: ChartControlsProps) {
  return (
    <div className={cn("flex items-center justify-between p-2", className)}>
      <div className="flex items-center gap-4">
        <ZoomControls
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
          onReset={onReset}
          disabled={zoomDisabled}
        />

        <div className="flex items-center gap-2 border-l pl-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onTimeframeChange('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onTimeframeChange('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={arrowStyle === 'curved' ? 'default' : 'outline'}
          size="sm"
          onClick={onArrowStyleToggle}
        >
          <ArrowsLeftRight className="h-4 w-4 mr-2" />
          {arrowStyle === 'curved' ? 'Curved' : 'Squared'}
        </Button>

        <div className="flex items-center rounded-md border">
          {(['day', 'week', 'month'] as const).map((view) => (
            <Button
              key={view}
              variant={granularity === view ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onGranularityChange(view)}
              className="capitalize"
            >
              <Calendar className="h-4 w-4 mr-2" />
              {view}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
