import { Task } from "@/types/task"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Copy, Save, Trash } from "lucide-react"
import { Card } from "@/components/ui/card"

interface TaskTemplate {
  id: string
  name: string
  description: string
  duration: number
  defaultProgress: number
  type: Task['type']
}

interface ChartTaskTemplatesProps {
  templates: TaskTemplate[]
  onApplyTemplate: (template: TaskTemplate) => void
  onSaveTemplate: (template: TaskTemplate) => void
  onDeleteTemplate: (templateId: string) => void
  className?: string
}

export function ChartTaskTemplates({
  templates,
  onApplyTemplate,
  onSaveTemplate,
  onDeleteTemplate,
  className
}: ChartTaskTemplatesProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Task Templates</h3>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="grid gap-4">
          {templates.map(template => (
            <Card key={template.id} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{template.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                  <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
                    <span>{template.duration} days</span>
                    <span>{template.defaultProgress}% progress</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onApplyTemplate(template)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteTemplate(template.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
