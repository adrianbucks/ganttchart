import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupAction,
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
  
  export function AppSidebar() {
	const { setOpenMobile, isMobile } = useSidebar()
	const { state, selectTask } = useTasksContext()
  
	const projects = state.tasks.filter((task) => task.type === 'project')
  
	const handleProjectSelect = (project: Task) => {
	  selectTask(project)
	  if (isMobile) {
		setOpenMobile(false)
	  }
	}
  
	return (
	  <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
		<SidebarHeader>Your Projects</SidebarHeader>
		<SidebarContent>
		  <SidebarGroup>
			<SidebarGroupLabel>Projects</SidebarGroupLabel>
			<SidebarGroupAction>
			  <TaskActionButton
				action="add"
				task={{ parentTask: '', type: 'project' } as Task}
				type="project"
				showText={false}
				wrapper="div"
			  />
			</SidebarGroupAction>
			<SidebarGroupContent>
			  <SidebarMenu>
				{projects.map((project) => (
				  <SidebarMenuItem key={project.id}>
					<SidebarMenuButton
					  onClick={() => handleProjectSelect(project)}
					>
					  <span>{project.name}</span>
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
  