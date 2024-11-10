import { useState } from 'react'
import { useChartZoom } from '@/hooks/useChartZoom'
import { ChartHeader } from './ChartHeader'
import { ChartGrid } from './ChartGrid'
import { ChartTask } from './ChartTask'
import { ChartDependency } from './ChartDependency'
import { ChartControls } from './ChartControls'
import { ChartScrollContainer } from './ChartScrollContainer'
import { ChartDateIndicator } from './ChartDateIndicator'
import { ChartSidebar } from './ChartSidebar'
import { useTasksContext } from '@/hooks/useTasksContext'
import { 
  calculateChartDimensions, 
  generateTimelineDates, 
  calculateTaskPosition,
  type ChartSettings 
} from '@/lib/visualization-utils'

interface GanttChartProps extends Partial<ChartSettings> {
	className?: string
}

export function GanttChart({
  showTaskLabels = true,
  granularity = 'day',
}: GanttChartProps) {
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null)
  const [arrowStyle, setArrowStyle] = useState<'curved' | 'squared'>('curved')
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const { dayWidth, zoomIn, zoomOut, reset, disabled } = useChartZoom()
  const { state } = useTasksContext()

  const selectedProject = state.selectedTask
  if (!selectedProject || selectedProject.type !== 'project') return null

  const projectTasks = state.tasks.filter(t => t.parentTask === selectedProject.id)
  
  const dimensions = calculateChartDimensions(
    projectTasks,
    dayWidth,
    selectedProject.startDate,
    selectedProject.endDate
  )

  const dates = generateTimelineDates(selectedProject.startDate, selectedProject.endDate)

  const handleToggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      if (next.has(groupId)) {
        next.delete(groupId)
      } else {
        next.add(groupId)
      }
      return next
    })
  }

  return (
    <div className="space-y-4">
      <ChartControls
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onReset={reset}
		onGranularityChange={()=> {}}
		onTimeframeChange={() => {}}
        onArrowStyleToggle={() => setArrowStyle(prev => prev === 'curved' ? 'squared' : 'curved')}
        granularity={granularity}
        arrowStyle={arrowStyle}
        zoomDisabled={disabled}
      />
      
      <ChartScrollContainer dimensions={dimensions}>
        <svg 
          width={dimensions.CHART_WIDTH} 
          height={dimensions.CHART_HEIGHT}
        >
          <ChartSidebar
            tasks={projectTasks}
            dimensions={dimensions}
            expandedGroups={expandedGroups}
            onToggleGroup={handleToggleGroup}
          />

          <ChartHeader
            dates={dates}
            granularity={granularity}
            dimensions={dimensions}
          />
          
          <ChartGrid
            dates={dates}
            dimensions={dimensions}
            granularity={granularity}
          />

          <ChartDateIndicator
            dimensions={dimensions}
            startDate={new Date(selectedProject.startDate)}
          />

          {projectTasks.map((task, index) => {
            const position = calculateTaskPosition(task, index, dimensions, selectedProject.startDate)
            return (
              <ChartTask
                key={task.id}
                task={task}
                index={index}
                dimensions={dimensions}
                position={position}
                showTaskLabels={showTaskLabels}
                hoveredTaskId={hoveredTaskId}
                selectedTaskId={state.taskToAction?.id || null}
                onTaskHover={setHoveredTaskId}
              />
            )
          })}

          {projectTasks.map((task) => (
            <ChartDependency
              key={`dep-${task.id}`}
              task={task}
              tasks={state.tasks}
              dimensions={dimensions}
              arrowStyle={arrowStyle}
            />
          ))}
        </svg>
      </ChartScrollContainer>
    </div>
  )
}
