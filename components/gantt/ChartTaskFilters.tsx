import { useState } from "react"
import { Task } from "@/types/task"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Filter, X, SortAsc, SortDesc } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface FilterCriteria {
  search: string
  progress: [number, number]
  startDate?: Date
  endDate?: Date
  sortBy: 'name' | 'startDate' | 'endDate' | 'progress'
  sortDirection: 'asc' | 'desc'
}

interface ChartTaskFiltersProps {
  tasks: Task[]
  onFilterChange: (filteredTasks: Task[]) => void
  className?: string
}

export function ChartTaskFilters({
  tasks,
  onFilterChange,
  className
}: ChartTaskFiltersProps) {
  const [filters, setFilters] = useState<FilterCriteria>({
    search: '',
    progress: [0, 100],
    sortBy: 'startDate',
    sortDirection: 'asc'
  })

  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const applyFilters = () => {
    let filteredTasks = [...tasks]

    // Apply search filter
    if (filters.search) {
      filteredTasks = filteredTasks.filter(task =>
        task.name.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    // Apply progress filter
    filteredTasks = filteredTasks.filter(task =>
      task.progress >= filters.progress[0] && task.progress <= filters.progress[1]
    )

    // Apply date filters
    if (filters.startDate) {
      filteredTasks = filteredTasks.filter(task =>
        task.startDate >= filters.startDate!
      )
    }
    if (filters.endDate) {
      filteredTasks = filteredTasks.filter(task =>
        task.endDate <= filters.endDate!
      )
    }

    // Apply sorting
    filteredTasks.sort((a, b) => {
      const direction = filters.sortDirection === 'asc' ? 1 : -1
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name) * direction
        case 'startDate':
          return (a.startDate.getTime() - b.startDate.getTime()) * direction
        case 'endDate':
          return (a.endDate.getTime() - b.endDate.getTime()) * direction
        case 'progress':
          return (a.progress - b.progress) * direction
        default:
          return 0
      }
    })

    onFilterChange(filteredTasks)
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      progress: [0, 100],
      sortBy: 'startDate',
      sortDirection: 'asc'
    })
    setActiveFilters([])
    onFilterChange(tasks)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4" />
        <h3 className="font-medium">Filters</h3>
        {activeFilters.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        <Input
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => {
            setFilters({ ...filters, search: e.target.value })
            applyFilters()
          }}
        />

        <div className="space-y-2">
          <label className="text-sm">Progress Range</label>
          <Slider
            value={filters.progress}
            min={0}
            max={100}
            step={5}
            onValueChange={(value) => {
              setFilters({ ...filters, progress: value as [number, number] })
              applyFilters()
            }}
          />
        </div>

        <div className="flex gap-2">
          {activeFilters.map(filter => (
            <Badge key={filter} variant="secondary">
              {filter}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => {
                  setActiveFilters(activeFilters.filter(f => f !== filter))
                }}
              />
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
