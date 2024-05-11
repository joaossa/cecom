import { Navigate, Outlet } from "react-router-dom";

export function PrivateRoutes() {
  let auth = { token: true };
  return auth.token ? <Outlet /> : <Navigate to="/login" replace />;
}
