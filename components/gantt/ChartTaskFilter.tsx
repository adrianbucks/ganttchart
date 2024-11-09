import { useState } from 'react'
import { Task } from "@/types/task"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, X } from "lucide-react"

interface ChartTaskFilterProps {
  tasks: Task[]
  onFilterChange: (filteredTasks: Task[]) => void
  className?: string
}

export function ChartTaskFilter({
  tasks,
  onFilterChange,
  className
}: ChartTaskFilterProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<{
    type?: Task['type']
    progress?: number
    hasChildren?: boolean
  }>({})

  const applyFilters = () => {
    const filtered = tasks.filter(task => {
      const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = !filters.type || task.type === filters.type
      const matchesProgress = !filters.progress || task.progress >= filters.progress
      const matchesChildren = !filters.hasChildren || tasks.some(t => t.parentTask === task.id)

      return matchesSearch && matchesType && matchesProgress && matchesChildren
    })

    onFilterChange(filtered)
  }

  return (
    <div className={className}>
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              applyFilters()
            }}
            className="pl-8"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => {
                setSearchTerm('')
                applyFilters()
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
