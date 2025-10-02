import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import OKRs from "./pages/OKRs";
import Organization from "./pages/Organization";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import SettingsUserManagement from "./pages/SettingsUserManagement";
import SettingsPage from "./pages/SettingsPage";
import SettingsProfile from "./pages/SettingsProfile";
import SettingsOrganization from "./pages/SettingsOrganization";
import SettingsExport from "./pages/SettingsExport";
import DocumentationPage from "./pages/DocumentationPage";
import { AuthProvider } from "./context/AuthContext";
import AppShell from "@/components/layout/AppShell";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute /> }>
              <Route element={<AppShell /> }>
                <Route path="/" element={<Index />} />
                <Route path="/okrs" element={<OKRs />} />
                <Route path="/organization" element={<Organization />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/documentation" element={<DocumentationPage />} />
                {/* Unified settings hub */}
                <Route path="/settings" element={<SettingsPage /> }>
                  <Route path="profile" element={<SettingsProfile />} />
                  <Route element={<AdminRoute /> }>
                    <Route path="organization" element={<SettingsOrganization />} />
                    <Route path="export" element={<SettingsExport />} />
                    <Route path="user-management" element={<SettingsUserManagement />} />
                  </Route>
                </Route>
              </Route>
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
