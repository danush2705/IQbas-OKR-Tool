import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Bell, Settings, LogOut, User, Crown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications] = useState<any[]>([]);

  const getInitials = (fullName: string) => {
    if (!fullName) return "";
    const parts = fullName.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] ?? "" : "";
    return `${first}${last}`.toUpperCase();
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      "CEO": { variant: "default", icon: Crown, className: "bg-gradient-primary" },
      "Manager": { variant: "secondary", icon: User, className: "bg-info" },
      "User": { variant: "outline", icon: User, className: "" }
    };
    
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.User;
    const IconComponent = config.icon;
    
    return (
      <Badge variant={config.variant as any} className={`gap-1 ${config.className}`}>
        <IconComponent className="w-3 h-3" />
        {role}
      </Badge>
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 bg-card border-b border-card-border px-6 flex items-center justify-between shadow-card sticky top-0 z-40">
            <div className="flex items-center gap-4">
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-card-foreground">OKR Dashboard</h1>
                <p className="text-xs text-muted-foreground">Q1 2025 Performance Review</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  aria-haspopup="true"
                  aria-expanded={isNotificationsOpen}
                  onClick={() => setIsNotificationsOpen((v) => !v)}
                  className="relative"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-danger rounded-full text-[10px] leading-4 flex items-center justify-center text-danger-foreground">
                      {notifications.length}
                    </span>
                  )}
                </Button>
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-md border border-card-border p-4 z-50">
                    {notifications.length === 0 ? (
                      <div className="text-center text-sm text-gray-600">You have no new notifications.</div>
                    ) : (
                      <ul className="space-y-2">
                        {notifications.map((n, idx) => (
                          <li key={idx} className="text-sm text-gray-800">{String(n)}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
              
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-3 p-2 h-auto">
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-medium text-card-foreground">{user?.name}</div>
                      <div className="flex items-center gap-2">
                        {user?.role ? getRoleBadge(user.role) : null}
                      </div>
                    </div>
                    <Avatar className="w-10 h-10 border-2 border-primary/20">
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                        {getInitials(user?.name || "")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover border border-card-border shadow-floating">
                  <div className="px-3 py-2 border-b border-card-border">
                    <p className="font-medium text-popover-foreground">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">{user?.role}</p>
                  </div>
                  
                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    <User className="w-4 h-4" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    <Settings className="w-4 h-4" />
                    System Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                    onClick={async () => {
                      await logout();
                      navigate("/login", { replace: true });
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          
          {/* Main Content */}
          <main className="flex-1 p-6 overflow-y-auto overflow-x-hidden max-w-full">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}