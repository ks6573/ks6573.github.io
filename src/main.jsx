import React from "react";
import ReactDOM from "react-dom/client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import App from "./App";
import AboutPage from "./AboutPage";
import ContactPage from "./ContactPage";
import ProjectsPage from "./ProjectsPage";
import "./styles.css";

const routeToIndex = {
  "/": 0,
  "/index.html": 0,
  "/projects": 1,
  "/projects.html": 1,
  "/about": 2,
  "/about.html": 2,
  "/contact": 3,
  "/contact.html": 3,
};

const pageTransition = {
  initial: ({ direction, reduceMotion }) => {
    if (reduceMotion) return { opacity: 0 };

    return {
      opacity: 0,
      x: direction * 26,
      y: 12,
      filter: "blur(1.8px)",
      scale: 0.998,
    };
  },
  animate: {
    opacity: 1,
    x: 0,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
  },
  exit: ({ direction, reduceMotion }) => {
    if (reduceMotion) return { opacity: 0 };

    return {
      opacity: 0,
      x: direction * -22,
      y: -8,
      filter: "blur(1.3px)",
      scale: 0.999,
    };
  },
};

const pageTransitionTiming = {
  duration: 0.28,
  ease: [0.22, 1, 0.36, 1],
};

function getRouteIndex(pathname) {
  return routeToIndex[pathname] ?? 0;
}

function RouteTransition({ children, direction, reduceMotion }) {
  return (
    <motion.div
      className="route-transition"
      custom={{ direction, reduceMotion }}
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
  const reduceMotion = useReducedMotion();
  const currentIndex = getRouteIndex(location.pathname);
  const previousIndexRef = React.useRef(currentIndex);
  const direction = currentIndex >= previousIndexRef.current ? 1 : -1;

  React.useEffect(() => {
    previousIndexRef.current = currentIndex;
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
  }, [location.pathname, currentIndex]);

  return (
    <AnimatePresence mode="wait" initial={false} custom={{ direction, reduceMotion }}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <RouteTransition direction={direction} reduceMotion={reduceMotion}>
              <App />
            </RouteTransition>
          }
        />
        <Route
          path="/index.html"
          element={
            <RouteTransition direction={direction} reduceMotion={reduceMotion}>
              <App />
            </RouteTransition>
          }
        />
        <Route
          path="/projects"
          element={
            <RouteTransition direction={direction} reduceMotion={reduceMotion}>
              <ProjectsPage />
            </RouteTransition>
          }
        />
        <Route
          path="/projects.html"
          element={
            <RouteTransition direction={direction} reduceMotion={reduceMotion}>
              <ProjectsPage />
            </RouteTransition>
          }
        />
        <Route
          path="/about"
          element={
            <RouteTransition direction={direction} reduceMotion={reduceMotion}>
              <AboutPage />
            </RouteTransition>
          }
        />
        <Route
          path="/about.html"
          element={
            <RouteTransition direction={direction} reduceMotion={reduceMotion}>
              <AboutPage />
            </RouteTransition>
          }
        />
        <Route
          path="/contact"
          element={
            <RouteTransition direction={direction} reduceMotion={reduceMotion}>
              <ContactPage />
            </RouteTransition>
          }
        />
        <Route
          path="/contact.html"
          element={
            <RouteTransition direction={direction} reduceMotion={reduceMotion}>
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
