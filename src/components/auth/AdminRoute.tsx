import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AccessDeniedModal from "@/components/common/AccessDeniedModal";

const AdminRoute: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  const role = (user as any)?.role as string | undefined;
  const isAdmin = Boolean((user as any)?.isAdmin) || role === 'ceo' || role === 'hr';
  if (!isAdmin) {
    // Show access denied modal in-place instead of redirecting
    return <AccessDeniedModal open />;
  }
  return <Outlet />;
};

export default AdminRoute;
