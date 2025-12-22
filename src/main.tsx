import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// GitHub Pages SPA redirect workaround
const redirectPath = sessionStorage.getItem('redirectPath');
if (redirectPath) {
  sessionStorage.removeItem('redirectPath');
  window.history.replaceState(null, '', redirectPath);
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  document.body.innerHTML = "<h1>Error: root element not found</h1>";
} else {
  createRoot(rootElement).render(<App />);
}
