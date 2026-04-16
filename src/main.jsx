import React from "react";
import ReactDOM from "react-dom/client";
import { AnimatePresence, motion } from "framer-motion";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import App from "./App";
import AboutPage from "./AboutPage";
import ContactPage from "./ContactPage";
import ProjectsPage from "./ProjectsPage";
import "./styles.css";

const pageTransition = {
  initial: { opacity: 0, y: 18, filter: "blur(1.2px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -14, filter: "blur(0.8px)" },
};

const pageTransitionTiming = {
  duration: 0.28,
  ease: [0.22, 1, 0.36, 1],
};

function RouteTransition({ children }) {
  return (
    <motion.div
      className="route-transition"
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransitionTiming}
    >
      {children}
    </motion.div>
  );
}

function AppRoutes() {
  const location = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    if (location.pathname === "/projects" || location.pathname === "/projects.html") {
      document.title = "Karan Seroy — Projects";
      return;
    }

    if (location.pathname === "/about" || location.pathname === "/about.html") {
      document.title = "Karan Seroy — About";
      return;
    }

    if (location.pathname === "/contact" || location.pathname === "/contact.html") {
      document.title = "Karan Seroy — Contact";
      return;
    }

    document.title = "Karan Seroy — ML Engineer";
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <RouteTransition>
              <App />
            </RouteTransition>
          }
        />
        <Route
          path="/index.html"
          element={
            <RouteTransition>
              <App />
            </RouteTransition>
          }
        />
        <Route
          path="/projects"
          element={
            <RouteTransition>
              <ProjectsPage />
            </RouteTransition>
          }
        />
        <Route
          path="/projects.html"
          element={
            <RouteTransition>
              <ProjectsPage />
            </RouteTransition>
          }
        />
        <Route
          path="/about"
          element={
            <RouteTransition>
              <AboutPage />
            </RouteTransition>
          }
        />
        <Route
          path="/about.html"
          element={
            <RouteTransition>
              <AboutPage />
            </RouteTransition>
          }
        />
        <Route
          path="/contact"
          element={
            <RouteTransition>
              <ContactPage />
            </RouteTransition>
          }
        />
        <Route
          path="/contact.html"
          element={
            <RouteTransition>
              <ContactPage />
            </RouteTransition>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </React.StrictMode>,
);
