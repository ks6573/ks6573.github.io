import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initPageTransitions } from "./pageTransitions";
import "./styles.css";

initPageTransitions();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
