import { Task } from "@/types/task"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tag, Plus, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

interface TaskLabel {
  id: string
  name: string
  color: string
  tasks: string[]
}

interface ChartTaskLabelsProps {
  tasks: Task[]
  labels: TaskLabel[]
  onLabelCreate: (label: Partial<TaskLabel>) => void
  onLabelUpdate: (labelId: string, updates: Partial<TaskLabel>) => void
  onLabelDelete: (labelId: string) => void
  onTaskLabel: (taskId: string, labelId: string) => void
  className?: string
}

export function ChartTaskLabels({
  tasks,
  labels,
  onLabelCreate,
  onLabelUpdate,
  onLabelDelete,
  onTaskLabel,
  className
}: ChartTaskLabelsProps) {
  const [newLabelName, setNewLabelName] = useState("")

  const handleCreateLabel = () => {
    if (!newLabelName.trim()) return
    onLabelCreate({
      name: newLabelName,
      color: generateRandomColor(),
      tasks: []
    })
    setNewLabelName("")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4" />
        <h3 className="font-medium">Labels</h3>
      </div>

      <div className="flex gap-2">
        <Input
          value={newLabelName}
          onChange={(e) => setNewLabelName(e.target.value)}
          placeholder="New label name..."
          className="flex-1"
        />
        <Button onClick={handleCreateLabel}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {labels.map(label => (
          <div
            key={label.id}
            className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: label.color }}
              />
              <span className="text-sm">{label.name}</span>
              <Badge variant="secondary" className="text-xs">
                {label.tasks.length}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLabelDelete(label.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

function generateRandomColor(): string {
  return `#${Math.floor(Math.random()*16777215).toString(16)}`
}
