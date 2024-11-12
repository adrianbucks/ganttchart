'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useTasksContext } from '@/hooks/useTasksContext'
import { useState } from 'react'
import { projectTimes } from '@/lib/projectTimes'
import { Task, defaultTaskVisualSettings } from '@/types/task'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export function TaskForm() {
  const { state, addTask, updateTask, deleteTask, setModalState, getChildTasks } = useTasksContext()
  const { taskToAction, modalMode, taskType } = state

  const [formData, setFormData] = useState<Task>(() => {
	if (modalMode === 'add') {
	  return {
		id: crypto.randomUUID(),
		name: '',
		description: '',
		type: taskType,
		startDate: taskType === 'project' ? Date.now() : state.selectedTask?.startDate || Date.now(),
		endDate: Date.now() + (taskType === 'project' ? 7 : 1) * 24 * 60 * 60 * 1000,
		duration: taskType === 'project' ? 7 : 1,
		progress: 0,
    order: 0,
		dependencies: [],
		parentTask: taskType === 'project' ? '' : state.selectedTask?.id || '',
    slack: 0,
    status: 'todo',
    priority: 'medium',
    visualSettings: defaultTaskVisualSettings,
	  }
	}
	
	return {
	  id: taskToAction?.id || '',
	  name: taskToAction?.name || '',
	  description: taskToAction?.description || '',
	  type: taskToAction?.type || 'task',
	  startDate: taskToAction?.startDate || Date.now(),
	  endDate: taskToAction?.endDate || Date.now(),
	  duration: taskToAction?.duration || 1,
	  progress: taskToAction?.progress || 0,
    order: taskToAction?.order || 0,
	  dependencies: taskToAction?.dependencies || [],
	  parentTask: taskToAction?.parentTask || '',
    slack: taskToAction?.slack || 0,
    status: taskToAction?.status || 'todo',
    priority: taskToAction?.priority || 'medium',
    visualSettings: taskToAction?.visualSettings || defaultTaskVisualSettings,
	}
  })
  

  const projectTasks = formData.type !== 'project' && formData.parentTask ? 
    getChildTasks(formData.parentTask).filter(t => t.type === 'task' && t.id !== formData.id) : 
    []

  if (modalMode === 'delete') {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          This will also delete all child tasks and milestones.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setModalState(false, 'delete')}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => {
              deleteTask(taskToAction!.id)
              setModalState(false, 'delete')
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    )
  }

  const handleTaskChange = (updates: Partial<Task>) => {
    if (updates.duration) {
      const newDuration = updates.duration
      setFormData(current => ({ 
        ...current, 
        ...updates,
        endDate: current.startDate + (newDuration * 24 * 60 * 60 * 1000)
      }))
    } else {
      setFormData(current => ({ ...current, ...updates }))
    }
  }  

  const handleSubmit = (e: React.FormEvent) => {
	e.preventDefault()
	
	let taskToSave = { ...formData }
	
	if (modalMode === 'add') {
	  if (taskToSave.type === 'project') {
		taskToSave = {
		  ...taskToSave,
		  duration: 7,
		  endDate: taskToSave.startDate + (7 * 24 * 60 * 60 * 1000)
		}
		const updatedTasks = [...state.tasks, taskToSave]
		addTask(taskToSave, updatedTasks)
	  } else {
		const parentProject = state.tasks.find(t => t.id === taskToSave.parentTask)!
		const dependencies = state.tasks.filter(t => taskToSave.dependencies?.includes(t.id))
		
		taskToSave = {
		  ...taskToSave,
		  duration: taskToSave.type === 'milestone' ? 0 : taskToSave.duration,
		  ...projectTimes.calculateTaskDates(taskToSave, parentProject.startDate, dependencies)
		}
		
		const updatedTasks = [...state.tasks, taskToSave]
		const recalculatedProjectTasks = projectTimes.recalculateProjectDates(parentProject, updatedTasks)
		const projectMetrics = projectTimes.calculateProjectMetrics(recalculatedProjectTasks)
		const updatedProject = { ...parentProject, ...projectMetrics }
		
		const finalTasks = updatedTasks.map(task => 
		  task.id === parentProject.id ? updatedProject :
		  task.parentTask === parentProject.id ? 
			recalculatedProjectTasks.find(t => t.id === task.id) || task : 
			task
		)
		
		addTask(taskToSave, finalTasks)
	  }
	} else {
	  const updatedTasks = state.tasks.map(t => t.id === taskToSave.id ? taskToSave : t)
	  
	  if (taskToSave.type === 'project') {
		const projectTasks = updatedTasks.filter(t => t.parentTask === taskToSave.id)
		if (projectTasks.length > 0) {
		  const recalculatedProjectTasks = projectTimes.recalculateProjectDates(taskToSave, updatedTasks)
		  const projectMetrics = projectTimes.calculateProjectMetrics(recalculatedProjectTasks)
		  const updatedProject = { ...taskToSave, ...projectMetrics }
		  
		  const finalTasks = updatedTasks.map(task => 
			task.id === taskToSave.id ? updatedProject :
			task.parentTask === taskToSave.id ? 
			  recalculatedProjectTasks.find(t => t.id === task.id) || task : 
			  task
		  )
		  
		  updateTask(taskToSave, finalTasks)
		} else {
		  const defaultProject = {
			...taskToSave,
			duration: 7,
			endDate: taskToSave.startDate + (7 * 24 * 60 * 60 * 1000)
		  }
		  updateTask(defaultProject, updatedTasks.map(t => 
			t.id === taskToSave.id ? defaultProject : t
		  ))
		}
	  } else {
		const parentProject = state.tasks.find(t => t.id === taskToSave.parentTask)!
		const dependencies = state.tasks.filter(t => taskToSave.dependencies?.includes(t.id))
		
		taskToSave = {
		  ...taskToSave,
		  ...projectTimes.calculateTaskDates(taskToSave, parentProject.startDate, dependencies)
		}
		
		const recalculatedProjectTasks = projectTimes.recalculateProjectDates(parentProject, updatedTasks)
		const projectMetrics = projectTimes.calculateProjectMetrics(recalculatedProjectTasks)
		const updatedProject = { ...parentProject, ...projectMetrics }
		
		const finalTasks = updatedTasks.map(task => 
		  task.id === parentProject.id ? updatedProject :
		  task.parentTask === parentProject.id ? 
			recalculatedProjectTasks.find(t => t.id === task.id) || task : 
			task
		)
		
		updateTask(taskToSave, finalTasks)
	  }
	}
	
	setModalState(false, modalMode)
  }   
  
  const currentParentTask = state.tasks.find(t => t.id === formData.parentTask)
  

  return (
    <form onSubmit={handleSubmit}>
		<div className="text-sm text-muted-foreground mb-4">
			Project: {currentParentTask?.name}
		</div>
      <div className="space-y-2">
        <Label htmlFor="name">{formData.type} Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleTaskChange({ name: e.target.value })}
          placeholder={`Enter ${formData.type} name`}
          disabled={state.loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleTaskChange({ description: e.target.value })}
          placeholder={`Enter ${formData.type} description`}
          rows={3}
          disabled={state.loading}
        />
      </div>

      {formData.type === 'project' ? (
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={new Date(formData.startDate).toISOString().split('T')[0]}
            onChange={(e) => {
              const newStartDate = new Date(e.target.value).getTime()
              handleTaskChange({
                startDate: newStartDate,
                endDate: newStartDate + (formData.duration * 24 * 60 * 60 * 1000),
              })
            }}
            disabled={state.loading}
          />
        </div>
      ) : formData.type !== 'milestone' && (
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (days)</Label>
          <Input
            id="duration"
            type="number"
            min="1"
            value={formData.duration}
            onChange={(e) => {
              const newDuration = Number(e.target.value)
              handleTaskChange({
                duration: newDuration,
                endDate: formData.startDate + newDuration * 24 * 60 * 60 * 1000,
              })
            }}
            placeholder="Enter duration"
            disabled={state.loading}
          />
        </div>
      )}

      {formData.type !== 'project' && projectTasks.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="dependencies">Dependencies</Label>
          <select
            id="dependencies"
            multiple
            value={formData.dependencies}
            onChange={(e) =>
              handleTaskChange({
                dependencies: Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                ),
              })
            }
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 min-h-[100px]"
            disabled={state.loading}
          >
            {projectTasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <p className="text-sm text-muted-foreground">
            Hold Ctrl/Cmd to select multiple tasks
          </p>
        </div>
      )}

      <Accordion type="single" collapsible>
        <AccordionItem value="details">
          <AccordionTrigger>More Details</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="progress">Progress (%)</Label>
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) =>
                    handleTaskChange({
                      progress: Number(e.target.value),
                    })
                  }
                  disabled={state.loading}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={state.loading}>
          {modalMode === 'add' ? `Create ${formData.type}` : `Update ${formData.type}`}
        </Button>
      </div>
    </form>
  )
}
