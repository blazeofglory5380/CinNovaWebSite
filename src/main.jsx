import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./App.css";
import App from "./App.jsx";
import { initAnalytics, trackPageView } from "./utils/analytics.js";

initAnalytics();
trackPageView(window.location.pathname + window.location.search);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
