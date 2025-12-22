import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  document.body.innerHTML = "<h1>Error: root element not found</h1>";
} else {
  createRoot(rootElement).render(<App />);
}
