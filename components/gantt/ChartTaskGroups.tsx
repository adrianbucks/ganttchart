import { Task } from "@/types/task"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FolderTree, ChevronRight, ChevronDown, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface TaskGroup {
  id: string
  name: string
  tasks: string[]
  color?: string
  expanded?: boolean
  subgroups?: TaskGroup[]
}

interface ChartTaskGroupsProps {
  tasks: Task[]
  groups: TaskGroup[]
  onGroupCreate: (group: Partial<TaskGroup>) => void
  onGroupUpdate: (groupId: string, updates: Partial<TaskGroup>) => void
  onGroupDelete: (groupId: string) => void
  className?: string
}

export function ChartTaskGroups({
  tasks,
  groups,
  onGroupCreate,
  onGroupUpdate,
  onGroupDelete,
  className
}: ChartTaskGroupsProps) {
  const renderGroup = (group: TaskGroup, depth = 0) => {
    const groupTasks = tasks.filter(task => group.tasks.includes(task.id))
    
    return (
      <div key={group.id} className="space-y-1">
        <div 
          className={cn(
            "flex items-center gap-2 p-2 rounded-md hover:bg-muted",
            group.expanded && "bg-muted"
          )}
          style={{ paddingLeft: `${depth * 1.5 + 0.5}rem` }}
        >
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-4 w-4"
            onClick={() => onGroupUpdate(group.id, { expanded: !group.expanded })}
          >
            {group.expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
          <span 
            className="flex-1 text-sm"
            style={{ color: group.color }}
          >
            {group.name} ({groupTasks.length})
          </span>
        </div>

        {group.expanded && (
          <div>
            {groupTasks.map(task => (
              <div
                key={task.id}
                className="flex items-center gap-2 p-2 text-sm text-muted-foreground hover:bg-muted"
                style={{ paddingLeft: `${(depth + 1) * 1.5 + 0.5}rem` }}
              >
                {task.name}
              </div>
            ))}
            {group.subgroups?.map(subgroup => renderGroup(subgroup, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderTree className="h-4 w-4" />
          <h3 className="font-medium">Task Groups</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onGroupCreate({ name: "New Group", tasks: [] })}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Group
        </Button>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          {groups.map(group => renderGroup(group))}
        </div>
      </ScrollArea>
    </div>
  )
}
