import { Navigate, Outlet } from "react-router-dom";
import PageLoader from "../components/common/PageLoader.jsx";
import useAuth from "../hooks/useAuth.js";

const GuestRoute = ({ children }) => {
  const { user, isAuthenticated, initializing } = useAuth();

  if (initializing) {
    return <PageLoader message="Checking your session" />;
  }

  if (isAuthenticated) {
    return <Navigate to={user?.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return children || <Outlet />;
};

export default GuestRoute;
