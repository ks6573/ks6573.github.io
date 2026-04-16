import React from "react";
import ReactDOM from "react-dom/client";
import ProjectsPage from "./ProjectsPage";
import { initPageTransitions } from "./pageTransitions";
import "./styles.css";

initPageTransitions();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ProjectsPage />
  </React.StrictMode>,
);
