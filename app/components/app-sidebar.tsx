import * as React from "react"

import { NavMain } from "~/components/nav-main"
import { NavSecondary } from "~/components/nav-secondary"
import { NavUser } from "~/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"
import { LayoutDashboardIcon, ListIcon, ChartBarIcon, FolderIcon, UsersIcon, CameraIcon, FileTextIcon, Settings2Icon, CircleHelpIcon, SearchIcon, DatabaseIcon, FileChartColumnIcon, FileIcon, CommandIcon, Building, HomeIcon, School, CheckLineIcon, UploadIcon, School2Icon, GroupIcon, UserStar, BookAIcon } from "lucide-react"

const data = {
  user: {
    name: "admin",
    email: "admin@example.com",
    avatar: "#",
  },
  navMain: [
    // {
    //   title: "Dashboard",
    //   url: "#",
    //   icon: <LayoutDashboardIcon />,
    // },
    {
      title: "المباني",
      url: "/dashboard/buildings",
      icon: <Building />,
    },
    {
      title: "القاعات",
      url: "/dashboard/halls",
      icon: <HomeIcon />,
    },
    {
      title: "الاقسام",
      url: "/dashboard/departments",
      icon: <School />,
    },
    {
      title: "المستويات",
      url: "/dashboard/levels",
      icon: <ChartBarIcon />,
    },
    {
      title: "الدفع",
      url: "/dashboard/batches",
      icon: <UsersIcon />,
    },
    {
      title: "المحاضرين",
      url: "/dashboard/instructors",
      icon: <UserStar />,
    },
    {
      title: "المقررات",
      url: "/dashboard/subjects",
      icon: <BookAIcon />,
    },
    {
      title: "المحاضرات",
      url: "/dashboard/lectures",
      icon: <FileTextIcon />,
    },
  ],
  navSecondary: [
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: <Settings2Icon />,
    // },
    // {
    //   title: "Get Help",
    //   url: "#",
    //   icon: <CircleHelpIcon />,
    // },
    // {
    //   title: "Search",
    //   url: "#",
    //   icon: <SearchIcon />,
    // },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: <DatabaseIcon />,
    },
    {
      name: "Reports",
      url: "#",
      icon: <FileChartColumnIcon />,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: <FileIcon />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <CommandIcon className="size-5!" />
                <span className="text-base font-semibold">Hall Management</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
