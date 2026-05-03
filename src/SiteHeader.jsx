import { LayoutGroup, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { key: "home", label: "Home", to: "/" },
  { key: "projects", label: "Projects", to: "/projects.html" },
  { key: "about", label: "About", to: "/about.html" },
  { key: "contact", label: "Contact", to: "/contact.html" },
];

function getActiveNavKey(pathname) {
  if (pathname === "/projects" || pathname === "/projects.html") return "projects";
  if (pathname === "/about" || pathname === "/about.html") return "about";
  if (pathname === "/contact" || pathname === "/contact.html") return "contact";
  return "home";
}

function SiteHeader() {
  const location = useLocation();
  const activeKey = getActiveNavKey(location.pathname);
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    try {
      const storedTheme = window.localStorage.getItem("portfolio-theme");
      if (storedTheme === "dark" || storedTheme === "light") return storedTheme;
      return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    } catch (_error) {
      return document.documentElement.dataset.theme === "light" ? "light" : "dark";
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    try {
      window.localStorage.setItem("portfolio-theme", theme);
    } catch (_error) {
      // Theme still updates even if storage is unavailable.
    }
  }, [theme]);

  useEffect(() => {
    function syncTheme(event) {
      if (event.detail === "dark" || event.detail === "light") {
        setTheme(event.detail);
      }
    }

    window.addEventListener("portfolio-theme-change", syncTheme);
    return () => window.removeEventListener("portfolio-theme-change", syncTheme);
  }, []);

  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="brand">
          <div>
            <div className="name">Karan Seroy</div>
            <div className="role">Machine Learning Engineer</div>
          </div>
        </div>

        <div className="header-actions">
          <nav className="nav" aria-label="Primary">
            <LayoutGroup id="primary-nav">
              {navItems.map((item) => {
                const isActive = item.key === activeKey;

                return (
                  <Link
                    key={item.key}
                    to={item.to}
                    className={`nav-link${isActive ? " is-active" : ""}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className="nav-link-text">{item.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-indicator"
                        className="nav-active-indicator"
                        transition={{ type: "spring", stiffness: 460, damping: 36, mass: 0.7 }}
                      />
                    )}
                  </Link>
                );
              })}
            </LayoutGroup>
          </nav>

          <button
            type="button"
            className="theme-toggle"
            onClick={() => setTheme(nextTheme)}
            aria-label={`Switch to ${nextTheme} mode`}
          >
            <span className="toggle-track" aria-hidden="true">
              <span className="toggle-thumb" />
            </span>
            <span>{theme === "dark" ? "Dark" : "Light"}</span>
          </button>

          <div className="live-status">
            <span aria-hidden="true" />
            Live
          </div>
        </div>
      </div>
    </header>
  );
}

export default SiteHeader;
