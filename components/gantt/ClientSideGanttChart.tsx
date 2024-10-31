import dynamic from 'next/dynamic'

const GanttChart = dynamic(() => import('./GanttChart'), { ssr: false })

export default GanttChart
