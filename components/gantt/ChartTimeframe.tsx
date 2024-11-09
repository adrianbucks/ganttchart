import { addDays, addWeeks, addMonths, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns"
import { useState, useCallback } from "react"

interface ChartTimeframeProps {
  startDate: Date
  endDate: Date
  granularity: 'day' | 'week' | 'month'
  onTimeframeChange: (newStartDate: Date, newEndDate: Date) => void
}

export function useChartTimeframe({
  initialStartDate = new Date(),
  initialEndDate = addMonths(new Date(), 3),
  granularity = 'day'
}: {
  initialStartDate?: Date
  initialEndDate?: Date
  granularity?: 'day' | 'week' | 'month'
}) {
  const [timeframe, setTimeframe] = useState({
    startDate: initialStartDate,
    endDate: initialEndDate
  })

  const adjustTimeframe = useCallback((direction: 'prev' | 'next') => {
    const { startDate, endDate } = timeframe
    const duration = endOfWeek(endDate).getTime() - startOfWeek(startDate).getTime()

    switch (granularity) {
      case 'day':
        setTimeframe({
          startDate: direction === 'prev' ? addDays(startDate, -7) : addDays(startDate, 7),
          endDate: direction === 'prev' ? addDays(endDate, -7) : addDays(endDate, 7)
        })
        break
      case 'week':
        setTimeframe({
          startDate: direction === 'prev' ? addWeeks(startDate, -4) : addWeeks(startDate, 4),
          endDate: direction === 'prev' ? addWeeks(endDate, -4) : addWeeks(endDate, 4)
        })
        break
      case 'month':
        setTimeframe({
          startDate: direction === 'prev' ? addMonths(startDate, -1) : addMonths(startDate, 1),
          endDate: direction === 'prev' ? addMonths(endDate, -1) : addMonths(endDate, 1)
        })
        break
    }
  }, [timeframe, granularity])

  const setGranularity = useCallback((newGranularity: 'day' | 'week' | 'month') => {
    const { startDate } = timeframe
    let newEndDate: Date

    switch (newGranularity) {
      case 'day':
        newEndDate = addDays(startDate, 30)
        break
      case 'week':
        newEndDate = addWeeks(startOfWeek(startDate), 12)
        break
      case 'month':
        newEndDate = endOfMonth(addMonths(startOfMonth(startDate), 3))
        break
      default:
        newEndDate = timeframe.endDate
    }

    setTimeframe({
      startDate,
      endDate: newEndDate
    })
  }, [timeframe])

  return {
    startDate: timeframe.startDate,
    endDate: timeframe.endDate,
    adjustTimeframe,
    setGranularity
  }
}
