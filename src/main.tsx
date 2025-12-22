import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Log version to confirm deployment update
console.log("🚀 Delphi LearnHub - Deployment v1.1 (Fixed Router Basename) - Loaded at " + new Date().toISOString());

const rootElement = document.getElementById("root");
if (!rootElement) {
  document.body.innerHTML = "<h1>Error: root element not found</h1>";
} else {
  createRoot(rootElement).render(<App />);
}
