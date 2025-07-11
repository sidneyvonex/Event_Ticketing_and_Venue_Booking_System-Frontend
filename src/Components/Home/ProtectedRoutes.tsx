import { useSelector } from "react-redux"
import type { RootState } from "../../Features/app/store"
import { Navigate } from "react-router"
import type { ProtectedRouteProps } from "../../types/types"





export default function ProtectedRoutes({ children }: ProtectedRouteProps) {
  //get states from payload

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
