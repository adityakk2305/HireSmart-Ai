import { Navigate, Outlet, useLocation } from "react-router-dom";
import PageLoader from "../components/common/PageLoader.jsx";
import useAuth from "../hooks/useAuth.js";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return <PageLoader message="Checking your session" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
