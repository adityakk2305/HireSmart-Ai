import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageLoader from "./components/common/PageLoader.jsx";
import ScrollToTop from "./components/common/ScrollToTop.jsx";
import { clearAuthState, initializeAuth } from "./features/auth/authSlice.js";
import { clearCompanyState, initializeCompany } from "./features/company/companySlice.js";
import AppRoutes from "./routes/AppRoutes.jsx";

const App = () => {
  const dispatch = useDispatch();
  const { initializing, isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(initializeAuth());

    const handleAuthExpired = () => {
      dispatch(clearAuthState());
      dispatch(clearCompanyState());
    };

    window.addEventListener("hiresmart:auth-expired", handleAuthExpired);
    return () => window.removeEventListener("hiresmart:auth-expired", handleAuthExpired);
  }, [dispatch]);

  useEffect(() => {
    if (!initializing && isAuthenticated && user?.role === "hr") {
      dispatch(initializeCompany());
    }

    if (!isAuthenticated || user?.role !== "hr") {
      dispatch(clearCompanyState());
    }
  }, [dispatch, initializing, isAuthenticated, user?.role]);

  if (initializing) {
    return <PageLoader message="Preparing secure session" />;
  }

  return (
    <>
      <ScrollToTop />
      <AppRoutes />
    </>
  );
};

export default App;
