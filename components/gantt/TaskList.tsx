'use client'

import { useTasksContext } from '@/hooks/useTasksContext'
import { TaskActionButton } from './TaskActionButton'

export function TaskList() {
  const { state, getChildTasks } = useTasksContext()
  const selectedProject = state.selectedTask

  if (!selectedProject || selectedProject.type !== 'project') {
    return null
  }

  const tasks = getChildTasks(selectedProject.id)

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center justify-between p-3 border rounded-md"
        >
          <div>
            <h3 className="font-medium">{task.name}</h3>
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {task.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <TaskActionButton
              action="edit"
              task={task}
              type={task.type}
              showText={false}
              wrapper="button"
            />
            <TaskActionButton
              action="delete"
              task={task}
              type={task.type}
              showText={false}
              wrapper="button"
            />
          </div>
        </div>
      ))}
    </div>
  )
}
