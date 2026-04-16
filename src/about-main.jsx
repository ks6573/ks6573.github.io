import React from "react";
import ReactDOM from "react-dom/client";
import AboutPage from "./AboutPage";
import { initPageTransitions } from "./pageTransitions";
import "./styles.css";

initPageTransitions();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AboutPage />
  </React.StrictMode>,
);
