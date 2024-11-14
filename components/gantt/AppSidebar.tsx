import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuAction,
	useSidebar,
	SidebarHeader,
  } from '@/components/ui/sidebar'
  import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu'
  import { MoreHorizontal } from 'lucide-react'
  import { useTasksContext } from '@/hooks/useTasksContext'
  import { TaskActionButton } from './TaskActionButton'
  import { Task } from '@/types/task'
import { cn } from '@/lib/utils'
import { LoadingSpinner } from '@/components/gantt/LoadingSpinner'
  
  export function AppSidebar() {
	const { setOpenMobile, isMobile } = useSidebar()
	const { selectTask, getProjects, state } = useTasksContext()

	if (state.loading) {
		return (
			<LoadingSpinner />
		  )
	  }
  
	const handleProjectSelect = (project: Task) => {
	  selectTask(project)
	  if (isMobile) {
		setOpenMobile(false)
	  }
	}

	const selectedProject = state.selectedTask
  
	return (
	  <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
		<SidebarHeader>Your Projects</SidebarHeader>
		<SidebarContent>
		<TaskActionButton
				action="add"
				task={{ parentTask: '', type: 'project' } as Task}
				type="project"
				showText={true}
				wrapper="button"
			  />
		  <SidebarGroup>
			<SidebarGroupLabel>Projects</SidebarGroupLabel>
			<SidebarGroupContent>
			  <SidebarMenu>
				{getProjects().map((project) => (
				  <SidebarMenuItem key={project.id}>
					<SidebarMenuButton
					  onClick={() => handleProjectSelect(project)}
					>
					  <span className={cn(project.id === selectedProject?.id && 'bold')}>{project.name}</span>
					</SidebarMenuButton>
					<div className="hidden md:block">
					  <DropdownMenu>
						<DropdownMenuTrigger asChild>
						  <SidebarMenuAction>
							<MoreHorizontal />
						  </SidebarMenuAction>
						</DropdownMenuTrigger>
						<DropdownMenuContent
						  side="right"
						  align="start"
						>
						  <DropdownMenuItem>
							<TaskActionButton
							  action="edit"
							  task={project}
							  type="project"
							  showText={true}
							  wrapper="div"
							/>
						  </DropdownMenuItem>
						  <DropdownMenuItem>
							<TaskActionButton
							  action="delete"
							  task={project}
							  type="project"
							  showText={true}
							  wrapper="div"
							/>
						  </DropdownMenuItem>
						</DropdownMenuContent>
					  </DropdownMenu>
					</div>
				  </SidebarMenuItem>
				))}
			  </SidebarMenu>
			</SidebarGroupContent>
		  </SidebarGroup>
		</SidebarContent>
	  </Sidebar>
	)
  }
  