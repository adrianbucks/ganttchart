import { useState, useMemo, useRef } from "react"
import { Task } from "@/types/task"
import { cn } from "@/lib/utils"
import { useChartZoom } from "@/hooks/useChartZoom"
import { ChartHeader } from "./ChartHeader"
import { ChartGrid } from "./ChartGrid"
import { ChartTask } from "./ChartTask"
import { ChartDependency } from "./ChartDependency"
import { ChartControls } from "./ChartControls"
import { ChartSidebar } from "./ChartSidebar"
import { ChartScrollContainer } from "./ChartScrollContainer"
import { ChartDateIndicator } from "./ChartDateIndicator"
import { ChartTaskDependencyEditor } from "./ChartTaskDependencyEditor"


export function GanttChart({
    projectName = "Enhanced Project Timeline",
    tasks: propTasks,
    startDate: propStartDate = new Date(2024, 0, 1),
    endDate: propEndDate = new Date(2024, 2, 15),
    showTaskLabels = true,
    className,
    granularity = 'day',
  }: GanttChartProps) {
    const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null)
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
    const [arrowStyle, setArrowStyle] = useState<'curved' | 'squared'>('curved')
    
    const { dayWidth, zoomIn, zoomOut, reset, disabled } = useChartZoom()
    
    const dimensions = {
      CHART_HEIGHT: 500,
      HEADER_HEIGHT: 80,
      ROW_HEIGHT: 40,
      LABEL_WIDTH: 200,
      DAY_WIDTH: dayWidth,
    }
  
    return (
      <div className={cn("space-y-4", className)}>
        <ChartControls
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onReset={reset}
          onGranularityChange={() => {}}
          onArrowStyleToggle={() => setArrowStyle(prev => prev === 'curved' ? 'squared' : 'curved')}
          granularity={granularity}
          arrowStyle={arrowStyle}
          zoomDisabled={disabled}
        />
  
        <ChartScrollContainer width={width} height={height}>
          <svg width={dimensions.CHART_WIDTH} height={dimensions.CHART_HEIGHT}>
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
  
            <ChartSidebar
              tasks={tasks}
              dimensions={dimensions}
              expandedGroups={expandedGroups}
              onToggleGroup={onToggleGroup}
              onTaskAction={onTaskAction}
            />
  
            {tasks.map(task => (
              <ChartTask
                key={task.id}
                task={task}
                dimensions={dimensions}
                isHovered={hoveredTaskId === task.id}
                isSelected={selectedTaskId === task.id}
                onHover={setHoveredTaskId}
                onSelect={setSelectedTaskId}
              />
            ))}
  
            {tasks.map(task => task.dependencies?.map(depId => {
              const fromTask = tasks.find(t => t.id === depId)
              if (!fromTask) return null
              return (
                <ChartDependency
                  key={`${depId}-${task.id}`}
                  fromTask={fromTask}
                  toTask={task}
                  hoveredTaskId={hoveredTaskId}
                  arrowStyle={arrowStyle}
                  dimensions={dimensions}
                  startDate={propStartDate}
                />
              )
            }))}
  
            <ChartDateIndicator
              dimensions={dimensions}
              startDate={propStartDate}
            />
          </svg>
        </ChartScrollContainer>
  
        <ChartTaskDependencyEditor
          tasks={tasks}
          dimensions={dimensions}
          onAddDependency={onAddDependency}
          onRemoveDependency={onRemoveDependency}
        />
      </div>
    )
  }
  