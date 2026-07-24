import { Navigate, Outlet, useLocation } from "react-router-dom";
import PageLoader from "../components/common/PageLoader.jsx";
import useAuth from "../hooks/useAuth.js";

const RoleRoute = ({ allowedRoles = [], children }) => {
  const { user, isAuthenticated, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return <PageLoader message="Checking permissions" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children || <Outlet />;
};

export default RoleRoute;
