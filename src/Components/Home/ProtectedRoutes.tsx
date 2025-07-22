import { useSelector } from "react-redux";
import type { RootState } from "../../Features/app/store";
import { Navigate, useLocation } from "react-router";
import type { ProtectedRouteProps } from "../../types/types";

export default function ProtectedRoutes({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role-based redirection
  const userRole = user?.userRole || user?.user?.userRole;
  const currentPath = location.pathname;

  // If admin tries to access user dashboard, redirect to admin dashboard
  if (userRole === "admin" && currentPath.startsWith("/dashboard")) {
    return <Navigate to="/admindashboard" replace />;
  }

  // If regular user tries to access admin dashboard, redirect to user dashboard
  if (userRole === "user" && currentPath.startsWith("/admindashboard")) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
