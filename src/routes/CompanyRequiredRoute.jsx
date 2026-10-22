import { Navigate, Outlet, useLocation } from "react-router-dom";
import PageLoader from "../components/common/PageLoader.jsx";
import useAuth from "../hooks/useAuth.js";
import useCompany from "../hooks/useCompany.js";

const CompanyRequiredRoute = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { hasCompany, initializing, requiresOnboarding } = useCompany();
  const isOnboardingRoute = location.pathname === "/dashboard/company-onboarding";

  if (user?.role !== "hr") {
    return children || <Outlet />;
  }

  if (initializing || (!hasCompany && !requiresOnboarding)) {
    return <PageLoader message="Checking company setup" />;
  }

  if (!isOnboardingRoute && (requiresOnboarding || !hasCompany)) {
    return <Navigate to="/dashboard/company-onboarding" replace state={{ from: location }} />;
  }

  return children || <Outlet />;
};

export default CompanyRequiredRoute;
