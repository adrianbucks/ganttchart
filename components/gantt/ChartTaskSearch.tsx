import { useState, useEffect } from "react"
import { Task } from "@/types/task"
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Calendar, Clock, BarChart2 } from "lucide-react"
import { format } from "date-fns"

interface ChartTaskSearchProps {
  tasks: Task[]
  isOpen: boolean
  onClose: () => void
  onTaskSelect: (taskId: string) => void
}

export function ChartTaskSearch({
  tasks,
  isOpen,
  onClose,
  onTaskSelect
}: ChartTaskSearchProps) {
  const [searchResults, setSearchResults] = useState<Task[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const filtered = tasks.filter(task =>
      task.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setSearchResults(filtered)
  }, [searchTerm, tasks])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0">
        <Command>
          <CommandInput
            placeholder="Search tasks..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>No tasks found.</CommandEmpty>
            <CommandGroup>
              {searchResults.map(task => (
                <CommandItem
                  key={task.id}
                  onSelect={() => {
                    onTaskSelect(task.id)
                    onClose()
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <div className="flex-1">
                      <p>{task.name}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(task.startDate, 'MMM d')} - {format(task.endDate, 'MMM d')}
                        </span>
                        <span className="flex items-center gap-1">
                          <BarChart2 className="h-3 w-3" />
                          {task.progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
