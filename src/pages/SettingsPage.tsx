import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

export default function SettingsPage() {
  const { user } = useAuth();
  const isAdmin = Boolean((user as any)?.isAdmin);
  const location = useLocation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 fade-in">
      {/* Left: Sub-navigation */}
      <Card className="p-4 h-fit">
        <div className="text-sm font-medium text-card-foreground mb-3">Settings</div>
        <nav className="space-y-1 text-sm">
          <NavLink to="/settings/profile" className={({isActive}) => isActive ? "block px-3 py-2 rounded bg-muted font-medium" : "block px-3 py-2 rounded hover:bg-muted"}>
            My Profile
          </NavLink>
          {isAdmin && (
            <NavLink to="/settings/user-management" className={({isActive}) => isActive ? "block px-3 py-2 rounded bg-muted font-medium" : "block px-3 py-2 rounded hover:bg-muted"}>
              User Management
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/settings/organization" className={({isActive}) => isActive ? "block px-3 py-2 rounded bg-muted font-medium" : "block px-3 py-2 rounded hover:bg-muted"}>
              Organization Settings
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/settings/export" className={({isActive}) => isActive ? "block px-3 py-2 rounded bg-muted font-medium" : "block px-3 py-2 rounded hover:bg-muted"}>
              Data Export
            </NavLink>
          )}
        </nav>
      </Card>

      {/* Right: Content */}
      <div>
        <Outlet />
      </div>
    </div>
  );
}
