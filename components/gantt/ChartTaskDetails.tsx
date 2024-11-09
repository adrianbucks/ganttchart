import { Task } from "@/types/task"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { TaskActionButton } from "./TaskActionButton"

interface ChartTaskDetailsProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onTaskAction: (action: 'edit' | 'delete', task: Task) => void
  relatedTasks?: Task[]
}

export function ChartTaskDetails({
  task,
  isOpen,
  onClose,
  onTaskAction,
  relatedTasks = []
}: ChartTaskDetailsProps) {
  if (!task) return null

  const dependencies = relatedTasks.filter(t => 
    task.dependencies?.includes(t.id)
  )

  const dependents = relatedTasks.filter(t => 
    t.dependencies?.includes(task.id)
  )

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px]">
        <SheetHeader>
          <SheetTitle>{task.name}</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Timeline</h3>
            <div className="text-sm">
              <p>Start: {format(task.startDate, 'PPP')}</p>
              <p>End: {format(task.endDate, 'PPP')}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Progress</h3>
            <div className="h-2 bg-muted rounded-full">
              <div 
                className="h-full bg-primary rounded-full"
                style={{ width: `${task.progress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">{task.progress}% complete</p>
          </div>

          {(dependencies.length > 0 || dependents.length > 0) && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Dependencies</h3>
              {dependencies.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">Depends on:</p>
                  <ul className="text-sm">
                    {dependencies.map(dep => (
                      <li key={dep.id}>{dep.name}</li>
                    ))}
                  </ul>
                </div>
              )}
              {dependents.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">Required by:</p>
                  <ul className="text-sm">
                    {dependents.map(dep => (
                      <li key={dep.id}>{dep.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <TaskActionButton
              action="edit"
              task={task}
              showText={true}
              wrapper="button"
            />
            <TaskActionButton
              action="delete"
              task={task}
              showText={true}
              wrapper="button"
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
