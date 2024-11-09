import { useState } from "react"
import { Task } from "@/types/task"
import { Button } from "@/components/ui/button"
import { Upload, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ChartTaskImportProps {
  onImport: (tasks: Task[]) => void
  onError: (message: string) => void
}

export function ChartTaskImport({
  onImport,
  onError
}: ChartTaskImportProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const content = await file.text()
      let tasks: Task[]

      if (file.name.endsWith('.json')) {
        tasks = JSON.parse(content)
      } else if (file.name.endsWith('.csv')) {
        tasks = parseCSV(content)
      } else {
        throw new Error('Unsupported file format')
      }

      validateTasks(tasks)
      onImport(tasks)
      setIsOpen(false)
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to import tasks'
      setError(message)
      onError(message)
    }
  }

  const parseCSV = (content: string): Task[] => {
    const lines = content.split('\n')
    const headers = lines[0].split(',')
    
    return lines.slice(1).map((line, index) => {
      const values = line.split(',')
      return {
        id: `imported-${index}`,
        name: values[0],
        startDate: new Date(values[1]),
        endDate: new Date(values[2]),
        progress: Number(values[3]),
        dependencies: values[4] ? values[4].split(';') : undefined,
        type: 'task'
      }
    })
  }

  const validateTasks = (tasks: Task[]) => {
    if (!Array.isArray(tasks)) {
      throw new Error('Invalid data format')
    }

    tasks.forEach(task => {
      if (!task.name || !task.startDate || !task.endDate) {
        throw new Error('Missing required task fields')
      }
    })
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
      >
        <Upload className="h-4 w-4 mr-2" />
        Import Tasks
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Tasks</DialogTitle>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <input
              type="file"
              accept=".json,.csv"
              onChange={handleFileUpload}
              className="block w-full text-sm text-muted-foreground
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-primary file:text-primary-foreground
                hover:file:bg-primary/90"
            />
            <p className="text-sm text-muted-foreground">
              Supported formats: JSON, CSV
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
