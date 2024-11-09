import { useState, useCallback } from 'react'

interface ZoomConfig {
  minDayWidth: number
  maxDayWidth: number
  defaultDayWidth: number
  zoomStep: number
}

export function useChartZoom(config: ZoomConfig = {
  minDayWidth: 20,
  maxDayWidth: 200,
  defaultDayWidth: 40,
  zoomStep: 20
}) {
  const [dayWidth, setDayWidth] = useState(config.defaultDayWidth)

  const zoomIn = useCallback(() => {
    setDayWidth(prev => Math.min(prev + config.zoomStep, config.maxDayWidth))
  }, [config.maxDayWidth, config.zoomStep])

  const zoomOut = useCallback(() => {
    setDayWidth(prev => Math.max(prev - config.zoomStep, config.minDayWidth))
  }, [config.minDayWidth, config.zoomStep])

  const reset = useCallback(() => {
    setDayWidth(config.defaultDayWidth)
  }, [config.defaultDayWidth])

  const isMaxZoom = dayWidth >= config.maxDayWidth
  const isMinZoom = dayWidth <= config.minDayWidth
  const isDefaultZoom = dayWidth === config.defaultDayWidth

  return {
    dayWidth,
    zoomIn,
    zoomOut,
    reset,
    disabled: {
      zoomIn: isMaxZoom,
      zoomOut: isMinZoom,
      reset: isDefaultZoom
    }
  }
}
