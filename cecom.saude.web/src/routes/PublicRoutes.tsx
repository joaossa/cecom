import { Navigate } from "react-router-dom";
import { LoginPage } from "../pages/Auth";

export function PublicRoutes() {
  return [
    { path: "/login", element: <LoginPage /> },
    { path: "*", element: <Navigate to="/login" replace /> },
  ];
}
