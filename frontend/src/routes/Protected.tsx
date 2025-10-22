// src/routes/Protected.tsx
import { Navigate, useLocation } from "react-router-dom";
import { getToken } from "../services/session";

export const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = getToken();
  const loc = useLocation();
  if (!token) return <Navigate to="/api/login" replace state={{ from: loc.pathname }} />;
  return <>{children}</>;
};
