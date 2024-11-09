import { Task } from "@/types/task"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format, isSameDay, isWithinInterval } from "date-fns"

interface ChartTaskCalendarProps {
  tasks: Task[]
  selectedDate?: Date
  onDateSelect: (date: Date | undefined) => void
  className?: string
}

export function ChartTaskCalendar({
  tasks,
  selectedDate,
  onDateSelect,
  className
}: ChartTaskCalendarProps) {
  const modifiers = {
    taskStart: tasks.map(task => task.startDate),
    taskEnd: tasks.map(task => task.endDate),
    taskDays: (date: Date) => 
      tasks.some(task => 
        isWithinInterval(date, { start: task.startDate, end: task.endDate })
      )
  }

  const modifiersStyles = {
    taskStart: "border-l-2 border-primary",
    taskEnd: "border-r-2 border-primary",
    taskDays: "bg-primary/10"
  }

  return (
    <div className={className}>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onDateSelect}
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
        footer={
          <div className="mt-3 space-y-2 text-sm">
            {tasks.filter(task => 
              selectedDate && isWithinInterval(selectedDate, { 
                start: task.startDate, 
                end: task.endDate 
              })
            ).map(task => (
              <div key={task.id} className="flex justify-between">
                <span>{task.name}</span>
                <span className="text-muted-foreground">{task.progress}%</span>
              </div>
            ))}
          </div>
        }
      />
    </div>
  )
}
