import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./App.css";
// Loaded after App.css so the global utilities layer over legacy page styles
// without needing to edit them.
import "./styles/cinnova-ui.css";
import App from "./App.jsx";
import { MotionShell } from "./motion/MotionShell.jsx";
import { ToastProvider } from "./ui/index.js";
import { initAnalytics } from "./utils/analytics.js";

initAnalytics();

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <MotionShell>
            <ToastProvider>
                <App />
            </ToastProvider>
        </MotionShell>
    </React.StrictMode>
);
