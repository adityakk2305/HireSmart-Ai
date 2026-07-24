import { Menu, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { closeMobileSidebar, openMobileSidebar } from "../../app/store.js";
import { APP_NAME } from "../../utils/constants.js";
import Button from "../common/Button.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

const PublicNavbar = () => {
  const dispatch = useDispatch();
  const mobileOpen = useSelector((state) => state.ui.mobileSidebarOpen);
  const [scrolled, setScrolled] = useState(false);
  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Features", path: "/features" },
    { label: "Pricing", path: "/pricing" }
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
      isActive
        ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
        : "text-slate-600 hover:bg-slate-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-300"
    }`;

  return (
    <header className={`sticky top-0 z-40 border-b bg-white/95 backdrop-blur transition dark:bg-slate-950/90 ${
      scrolled ? "border-slate-200 shadow-sm dark:border-slate-800" : "border-transparent dark:border-slate-900"
    }`}>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-white">
          <span className="rounded-lg bg-blue-600 p-2 text-white">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          {APP_NAME}
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={navClass}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link to="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link to="/register">
            <Button>Register</Button>
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden"
          onClick={() => dispatch(mobileOpen ? closeMobileSidebar() : openMobileSidebar())}
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileOpen ? (
        <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg dark:border-slate-800 dark:bg-slate-950 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={() => dispatch(closeMobileSidebar())}
                className={navClass}
              >
                {item.label}
              </NavLink>
            ))}
            <div className="pt-1">
              <ThemeToggle />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link to="/login" onClick={() => dispatch(closeMobileSidebar())}>
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
              <Link to="/register" onClick={() => dispatch(closeMobileSidebar())}>
                <Button className="w-full">Register</Button>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default PublicNavbar;
