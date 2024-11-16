import { useState, useCallback, useEffect } from 'react'

type Granularity = 'day' | 'week' | 'month'

interface ZoomSettings {
  default: number
  min: number
  max: number
  step: number
}

const ZOOM_SETTINGS: Record<Granularity, ZoomSettings> = {
  day: {
    default: 40,
    min: 10,
    max: 100,
    step: 10
  },
  week: {
    default: 50,
    min: 20,
    max: 120,
    step: 10
  },
  month: {
    default: 60,
    min: 20,
    max: 200,
    step: 20
  }
}

export function useChartZoom(granularity: Granularity) {
  const [dayWidth, setDayWidth] = useState(ZOOM_SETTINGS[granularity].default)

  useEffect(() => {
    setDayWidth(ZOOM_SETTINGS[granularity].default)
  }, [granularity])

  const zoomIn = useCallback(() => {
    setDayWidth(prev => Math.min(prev + ZOOM_SETTINGS[granularity].step, ZOOM_SETTINGS[granularity].max))
  }, [granularity])

  const zoomOut = useCallback(() => {
    setDayWidth(prev => Math.max(prev - ZOOM_SETTINGS[granularity].step, ZOOM_SETTINGS[granularity].min))
  }, [granularity])

  const reset = useCallback(() => {
    setDayWidth(ZOOM_SETTINGS[granularity].default)
  }, [granularity])

  return {
    dayWidth,
    zoomIn,
    zoomOut,
    reset,
    disabled: {
      zoomIn: dayWidth >= ZOOM_SETTINGS[granularity].max,
      zoomOut: dayWidth <= ZOOM_SETTINGS[granularity].min,
      reset: dayWidth === ZOOM_SETTINGS[granularity].default
    }
  }
}
