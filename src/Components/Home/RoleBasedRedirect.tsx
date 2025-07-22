import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import type { RootState } from "../../Features/app/store";

export const RoleBasedRedirect = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user?.userRole || user?.user?.userRole;

  // Redirect based on user role
  if (userRole === "admin") {
    return <Navigate to="/admindashboard" replace />;
  } else {
    return <Navigate to="/dashboard" replace />;
  }
};
