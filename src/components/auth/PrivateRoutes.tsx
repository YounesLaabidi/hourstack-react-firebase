import { useAuth } from "@/contexts/AuthProvider";
import { Outlet, Navigate } from "react-router-dom";
const PrivateRoutes = () => {
  const { currentUser } = useAuth();
  return currentUser ? <Outlet /> : <Navigate to="/" />;
};

const PublicRoutes = () => {
  const { currentUser } = useAuth();
  return !currentUser ? <Outlet /> : <Navigate to="/main" />;
};

export { PrivateRoutes, PublicRoutes };
