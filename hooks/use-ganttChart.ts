const useGanttChart = (props: GanttChartProps) => {
  const {
    tasks: propTasks,
    startDate: propStartDate = new Date(2024, 0, 1),
    endDate: propEndDate = new Date(2024, 2, 15),
    granularity = 'day',
  } = props

  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [arrowStyle, setArrowStyle] = useState<'curved' | 'squared'>('curved')

  const tasks = useMemo(() => {
    if (propTasks && propTasks.length > 0) {
      return propTasks
    }
    return generateDummyData(propStartDate, propEndDate)
  }, [propTasks, propStartDate, propEndDate])

  const CHART_HEIGHT = 500
  const HEADER_HEIGHT = 80
  const ROW_HEIGHT = 40
  const LABEL_WIDTH = 200
  const DAY_WIDTH = granularity === 'day' ? 40 : granularity === 'week' ? 100 : 200

  const totalDays = differenceInDays(propEndDate, propStartDate) + 1
  const CHART_WIDTH = LABEL_WIDTH + totalDays * DAY_WIDTH

  const dates = useMemo(() => Array.from({ length: totalDays }, (_, i) => addDays(propStartDate, i)), [propStartDate, totalDays])

  const getXFromDate = (date: Date) => {
    const days = differenceInDays(date, propStartDate)
    return LABEL_WIDTH + days * DAY_WIDTH
  }

  return {
    hoveredTaskId,
    setHoveredTaskId,
    selectedTaskId,
    setSelectedTaskId,
    arrowStyle,
    setArrowStyle,
    tasks,
    dates,
    CHART_HEIGHT,
    HEADER_HEIGHT,
    ROW_HEIGHT,
    LABEL_WIDTH,
    DAY_WIDTH,
    CHART_WIDTH,
    getXFromDate,
    granularity,
  }
}