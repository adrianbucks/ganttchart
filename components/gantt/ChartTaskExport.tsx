import { Task } from "@/types/task"
import { Button } from "@/components/ui/button"
import { Download, FileJson, FileText, Table } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ChartTaskExportProps {
  tasks: Task[]
  projectName: string
}

export function ChartTaskExport({
  tasks,
  projectName
}: ChartTaskExportProps) {
  const exportToCSV = () => {
    const headers = ['Name', 'Start Date', 'End Date', 'Progress', 'Dependencies']
    const csvData = tasks.map(task => [
      task.name,
      task.startDate.toISOString(),
      task.endDate.toISOString(),
      task.progress,
      task.dependencies?.join(';') || ''
    ])
    
    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n')
    downloadFile(csv, `${projectName}-tasks.csv`, 'text/csv')
  }

  const exportToJSON = () => {
    const json = JSON.stringify(tasks, null, 2)
    downloadFile(json, `${projectName}-tasks.json`, 'application/json')
  }

  const exportToText = () => {
    const text = tasks.map(task => 
      `${task.name}\nStart: ${task.startDate.toLocaleDateString()}\nEnd: ${task.endDate.toLocaleDateString()}\nProgress: ${task.progress}%\n`
    ).join('\n')
    downloadFile(text, `${projectName}-tasks.txt`, 'text/plain')
  }

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={exportToCSV}>
          <Table className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON}>
          <FileJson className="h-4 w-4 mr-2" />
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToText}>
          <FileText className="h-4 w-4 mr-2" />
          Export as Text
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
