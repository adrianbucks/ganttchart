import { Task } from "@/types/task"
import { cn } from "@/lib/utils"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

interface ChartTaskBoardProps {
  tasks: Task[]
  onTaskMove: (taskId: string, status: string) => void
  className?: string
}

export function ChartTaskBoard({
  tasks,
  onTaskMove,
  className
}: ChartTaskBoardProps) {
  const columns = {
    todo: {
      title: "To Do",
      tasks: tasks.filter(t => t.progress === 0)
    },
    inProgress: {
      title: "In Progress",
      tasks: tasks.filter(t => t.progress > 0 && t.progress < 100)
    },
    completed: {
      title: "Completed",
      tasks: tasks.filter(t => t.progress === 100)
    }
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const taskId = result.draggableId
    const newStatus = result.destination.droppableId
    onTaskMove(taskId, newStatus)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className={cn("grid grid-cols-3 gap-4", className)}>
        {Object.entries(columns).map(([columnId, column]) => (
          <Droppable key={columnId} droppableId={columnId}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-muted p-4 rounded-lg"
              >
                <h3 className="font-medium mb-4">{column.title}</h3>
                <div className="space-y-2">
                  {column.tasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-background p-3 rounded-md shadow-sm"
                        >
                          <p className="text-sm font-medium">{task.name}</p>
                          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                            <span>{task.startDate.toLocaleDateString()}</span>
                            <span>{task.progress}%</span>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  )
}
