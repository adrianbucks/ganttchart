import { useState, useEffect } from "react"
import { Task } from "@/types/task"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

interface ChartTaskDialogProps {
  task?: Task
  isOpen: boolean
  mode: 'add' | 'edit'
  onClose: () => void
  onSave: (taskData: Partial<Task>) => void
  availableParentTasks?: Task[]
}

export function ChartTaskDialog({
  task,
  isOpen,
  mode,
  onClose,
  onSave,
  availableParentTasks = []
}: ChartTaskDialogProps) {
  const [taskData, setTaskData] = useState<Partial<Task>>({
    name: '',
    startDate: new Date(),
    endDate: new Date(),
    progress: 0,
    type: 'task'
  })

  useEffect(() => {
    if (task && mode === 'edit') {
      setTaskData(task)
    }
  }, [task, mode])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Add New Task' : 'Edit Task'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name">Task Name</label>
            <Input
              id="name"
              value={taskData.name}
              onChange={(e) => setTaskData({ ...taskData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label>Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {taskData.startDate ? format(taskData.startDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={taskData.startDate}
                    onSelect={(date) => date && setTaskData({ ...taskData, startDate: date })}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <label>End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {taskData.endDate ? format(taskData.endDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={taskData.endDate}
                    onSelect={(date) => date && setTaskData({ ...taskData, endDate: date })}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => onSave(taskData)}>
              {mode === 'add' ? 'Add Task' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
