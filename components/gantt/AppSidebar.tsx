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
import { PlusCircle, MoreHorizontal } from 'lucide-react'
import { useEffect } from 'react'
import { Project } from '@/types/project'

interface AppSidebarProps {
	projects: Project[]
	selectedProject: Project | null
	onProjectSelect: (project: Project | null) => void
	onNewProjectClick: () => void
	onEditProject: (project: Project) => void
	onDeleteProject: (projectId: string) => void
}
export function AppSidebar({
	projects,
	selectedProject,
	onProjectSelect,
	onNewProjectClick,
	onEditProject,
	onDeleteProject,
}: AppSidebarProps) {
	const { setOpen, setOpenMobile, isMobile } = useSidebar()

	useEffect(() => {
		if (isMobile) {
			setOpen(false)
			setOpenMobile(false)
		} else {
			setOpen(true)
			setOpenMobile(true)
		}
	}, [isMobile, setOpen, setOpenMobile])

	return (
		<Sidebar
			side="left"
			variant="sidebar"
			collapsible="offcanvas"
			// open={isMobile ? openMobile : open}
			// onOpenChange={isMobile ? setOpenMobile : setOpen}
		>
			<SidebarHeader>Your Projects</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Projects</SidebarGroupLabel>
					<SidebarGroupAction
						onClick={onNewProjectClick}
						role="button"
						title="Add Project"
					>
						<PlusCircle />
						<span className="sr-only">Add Project</span>
					</SidebarGroupAction>
					<SidebarGroupContent>
						<SidebarMenu>
							{projects.map((project) => (
								<SidebarMenuItem key={project.id}>
									<SidebarMenuButton
										onClick={() => onProjectSelect(project)}
										className={
											selectedProject?.id === project.id
												? 'bg-accent'
												: ''
										}
									>
										<span>{project.name}</span>
									</SidebarMenuButton>
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
											<DropdownMenuItem
												onClick={() =>
													onEditProject(project)
												}
											>
												<span>Edit Project</span>
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() =>
													onDeleteProject(project.id)
												}
											>
												<span>Delete Project</span>
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	)
}
