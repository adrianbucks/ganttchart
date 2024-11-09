import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useTasksContext } from '@/hooks/useTasksContext'
import { TaskActionButton } from './TaskActionButton'
import { differenceInDays } from 'date-fns'

export function ProjectDetails() {
  const { state, getChildTasks } = useTasksContext()
  const selectedProject = state.tasks.find(t => t.id === state.selectedTask?.id)

  if (!selectedProject || selectedProject.type !== 'project') {
    return null
  }

  const childTasks = getChildTasks(selectedProject.id)
  const taskCount = childTasks.length
  const duration = differenceInDays(
    new Date(selectedProject.endDate),
    new Date(selectedProject.startDate)
  )

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">
            {selectedProject.name}
          </h2>
          <div className="flex gap-2">
            <TaskActionButton
              action="edit"
              task={selectedProject}
              type="project"
              showText={false}
              wrapper="button"
            />
            <TaskActionButton
              action="delete"
              task={selectedProject}
              type="project"
              showText={false}
              wrapper="button"
            />
          </div>
        </div>
        <TaskActionButton
          action="add"
          task={selectedProject}
          type="task"
          showText={true}
          wrapper="button"
        />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Start Date</p>
            <p className="font-medium">
              {new Date(selectedProject.startDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">End Date</p>
            <p className="font-medium">
              {new Date(selectedProject.endDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Duration</p>
            <p className="font-medium">{duration} days</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tasks</p>
            <p className="font-medium">{taskCount}</p>
          </div>
        </div>
        {selectedProject.description && (
          <p className="text-sm text-muted-foreground">
            {selectedProject.description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
