import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// #region agent log
const rootEl = document.getElementById("root");
if (!rootEl) {
  fetch("http://127.0.0.1:7683/ingest/d1ed7b71-be6e-4f7b-88ca-db5fa32ff6c7", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "e75e82" },
    body: JSON.stringify({
      sessionId: "e75e82",
      location: "main.tsx:root",
      message: "root element missing",
      data: {},
      timestamp: Date.now(),
      hypothesisId: "H1",
    }),
  }).catch(() => {});
} else {
  fetch("http://127.0.0.1:7683/ingest/d1ed7b71-be6e-4f7b-88ca-db5fa32ff6c7", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "e75e82" },
    body: JSON.stringify({
      sessionId: "e75e82",
      location: "main.tsx:beforeRender",
      message: "about to createRoot and render",
      data: {},
      timestamp: Date.now(),
      hypothesisId: "H5",
    }),
  }).catch(() => {});
}
// #endregion
try {
  createRoot(document.getElementById("root")!).render(<App />);
  fetch("http://127.0.0.1:7683/ingest/d1ed7b71-be6e-4f7b-88ca-db5fa32ff6c7", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "e75e82" },
    body: JSON.stringify({
      sessionId: "e75e82",
      location: "main.tsx:afterRender",
      message: "App render scheduled",
      data: {},
      timestamp: Date.now(),
      hypothesisId: "H1",
    }),
  }).catch(() => {});
} catch (e) {
  fetch("http://127.0.0.1:7683/ingest/d1ed7b71-be6e-4f7b-88ca-db5fa32ff6c7", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "e75e82" },
    body: JSON.stringify({
      sessionId: "e75e82",
      location: "main.tsx:catch",
      message: "sync error in main",
      data: { err: String(e) },
      timestamp: Date.now(),
      hypothesisId: "H1",
    }),
  }).catch(() => {});
  throw e;
}
