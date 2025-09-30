import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  Building2,
  Download,
  Target,
  Users,
  Settings,
  TrendingUp,
  Calendar,
  FileText
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import logo from "@/assets/iqbas-logo.png";

const mainNavigation = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
  { title: "OKRs", url: "/okrs", icon: Target },
  { title: "Organization", url: "/organization", icon: Building2 },
  { title: "Reports", url: "/reports", icon: TrendingUp },
];

const managementNavigation = [
  { title: "Team Management", url: "/team", icon: Users },
  { title: "Time Periods", url: "/periods", icon: Calendar },
  { title: "Export Data", url: "/export", icon: Download },
];

const systemNavigation = [
  { title: "Documentation", url: "/docs", icon: FileText },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    `${isActive 
      ? "bg-sidebar-accent text-sidebar-primary-foreground font-medium border-r-2 border-sidebar-primary" 
      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
    } transition-all duration-200`;

  return (
    <Sidebar
      className="w-64 shrink-0 border-r border-sidebar-border bg-sidebar"
      collapsible="none"
    >
      <SidebarContent className="p-4">
        {/* Brand */}
        <div className="mb-8 px-2">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center">
              <img src={logo} alt="IQbas" className="w-7 h-7 object-contain" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">IQbas OKR Tool</h1>
              <p className="text-xs text-sidebar-foreground/70">Track & Achieve</p>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium">Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls({ isActive: isActive(item.url) })}>
                      <item.icon className="w-4 h-4 mr-3 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

            {/* Divider and subtle System section integrated into main list */}
            <div className="my-3 px-2">
              <hr className="border-t border-sidebar-border" />
              <div className="mt-3 text-xs uppercase tracking-wider text-gray-500">System</div>
            </div>
            <SidebarMenu>
              {systemNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls({ isActive: isActive(item.url) })}>
                      <item.icon className="w-4 h-4 mr-3 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management Navigation */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium">Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls({ isActive: isActive(item.url) })}>
                      <item.icon className="w-4 h-4 mr-3 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Removed separate System group to keep a unified navigation flow */}
      </SidebarContent>
    </Sidebar>
  );
}