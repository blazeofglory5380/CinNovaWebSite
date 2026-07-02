import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./App.css";
import App from "./App.jsx";
import { MotionShell } from "./motion/MotionShell.jsx";
import { initAnalytics } from "./utils/analytics.js";

initAnalytics();

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <MotionShell>
            <App />
        </MotionShell>
    </React.StrictMode>
);
