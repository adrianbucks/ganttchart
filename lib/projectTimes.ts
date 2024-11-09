import { Task } from '@/types/task'

export const projectTimes = {
  calculateTaskDates(task: Task, projectStartDate: number, dependencies: Task[] = []) {
    const startDate = dependencies.length 
      ? Math.max(...dependencies.map(d => d.endDate))
      : projectStartDate
    
    return {
      startDate,
      endDate: startDate + ((task.duration || 1) * 24 * 60 * 60 * 1000)
    }
  },

  calculateProjectMetrics(tasks: Task[]) {
    const projectTasks = tasks.filter(t => t.type !== 'milestone')
    if (!projectTasks.length) return null
    
    return {
      endDate: Math.max(...projectTasks.map(t => t.endDate)),
      duration: Math.ceil((Math.max(...projectTasks.map(t => t.endDate)) - Math.min(...projectTasks.map(t => t.startDate))) / (24 * 60 * 60 * 1000)),
      progress: projectTasks.reduce((acc, task) => acc + (task.progress || 0), 0) / projectTasks.length
    }
  },

  recalculateProjectDates(project: Task, tasks: Task[]) {
    const projectTasks = tasks.filter(t => t.parentTask === project.id)
    return projectTasks.reduce((acc, task) => {
      const dependencies = tasks.filter(t => (task.dependencies || []).includes(t.id))
      const dates = this.calculateTaskDates(task, project.startDate, dependencies)
      return [...acc, { ...task, ...dates }]
    }, [] as Task[])
  },

  previewTaskChanges(task: Task, tasks: Task[]) {
    const dependencies = tasks.filter(t => (task.dependencies || []).includes(t.id))
    const dates = this.calculateTaskDates(task, task.startDate, dependencies)
    const affectedTasks = this.getAffectedTasks(task.id, tasks)
    
    return affectedTasks.map(t => ({
      ...t,
      ...this.calculateTaskDates(t, dates.startDate, dependencies)
    }))
  },

  getAffectedTasks(taskId: string, tasks: Task[]): Task[] {
    const dependentTasks = tasks.filter(t => (t.dependencies || []).includes(taskId))
    return [...dependentTasks, ...dependentTasks.flatMap(t => this.getAffectedTasks(t.id, tasks))]
  }
}
