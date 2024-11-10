'use client'

import { SidebarTrigger, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/gantt/AppSidebar'
import { ProjectDetails } from '@/components/gantt/ProjectDetails'
import { TasksProvider } from './TasksContext'
import { useTasksContext } from '@/hooks/useTasksContext'
import { TaskModal } from './TaskModal'
import { TaskList } from './TaskList'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import GanttChart from './EnhancedGanttChart'
import { Task } from '@/types/task'

function Dashboard() {
	const { state, getChildTasks } = useTasksContext()

	return (
		<SidebarProvider defaultOpen={true}>
			<div className="flex w-full h-screen">
				<AppSidebar />
				<div className="flex flex-col flex-1 min-w-0">
					<header className="sticky top-0 z-10 bg-background border-b">
						<div className="flex items-center justify-between px-4 h-14">
							<div className="flex items-center gap-4">
								<SidebarTrigger />
								<h1 className="text-xl font-semibold">
									Gantt Chart App
								</h1>
							</div>
						</div>
						{state.selectedTask?.type === 'project' && (
							<div className="px-4 py-3 border-t bg-muted/50">
								<ProjectDetails />
							</div>
						)}
					</header>

					<main className="flex-1 min-h-0 p-4">
						<Tabs
							defaultValue="tasks-list"
							className="flex flex-col flex-1 min-h-0"
						>
							<TabsList className="flex-shrink-0">
								<TabsTrigger value="tasks-list">
									Tasks List
								</TabsTrigger>
								<TabsTrigger value="gantt">
									Gantt Chart
								</TabsTrigger>
							</TabsList>
							<TabsContent value="tasks-list">
								<TaskList />
							</TabsContent>
							<TabsContent value="gantt">
								<GanttChart
								projectName={state.selectedTask?.name}
								tasks={getChildTasks(state.selectedTask?.id as string) as Task[]}
								/>
							</TabsContent>
						</Tabs>
					</main>
				</div>
			</div>

			<TaskModal />
		</SidebarProvider>
	)
}

export function ProjectDashboard() {
	return (
		<TasksProvider>
			<Dashboard />
		</TasksProvider>
	)
}
