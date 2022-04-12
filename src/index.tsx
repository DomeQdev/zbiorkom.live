import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import "./index.css";
import "react-spring-bottom-sheet/dist/style.css";
import "react-toastify/dist/ReactToastify.css";
import "leaflet/dist/leaflet.css";

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);