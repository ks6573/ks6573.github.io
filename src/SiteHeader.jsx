import { LayoutGroup, motion } from "framer-motion";
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

  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="brand">
          <div className="avatar" />
          <div>
            <div className="name">Karan Seroy</div>
            <div className="role">Machine Learning Engineer</div>
          </div>
        </div>

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
      </div>
    </header>
  );
}

export default SiteHeader;
