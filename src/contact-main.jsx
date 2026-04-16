import React from "react";
import ReactDOM from "react-dom/client";
import ContactPage from "./ContactPage";
import { initPageTransitions } from "./pageTransitions";
import "./styles.css";

initPageTransitions();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ContactPage />
  </React.StrictMode>,
);
