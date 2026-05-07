import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from "@/pages/ErrorBoundary";
import { CssBaseline } from "@mui/material";
import ReactDOM from "react-dom/client";
import { initMobileApp } from "./native/mobile";
import App from "./App";

import "./components/util/register";
import "./components/sheet/sheet.css";
import "./index.css";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnReconnect: false,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            retry: false,
        },
    },
});

window.historyLength = window.history.length;

initMobileApp().catch((error) => {
    console.error("Native mobile bootstrap failed:", error);
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
            <CssBaseline />
            <App />
        </ErrorBoundary>
    </QueryClientProvider>,
);
