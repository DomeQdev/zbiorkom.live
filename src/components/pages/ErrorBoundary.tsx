import React, { useEffect } from "react";
import Error from "./Error";

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };

        this.setupGlobalErrorHandlers();
    }

    setupGlobalErrorHandlers = () => {
        window.addEventListener("error", (event) => {
            if (event.error && event.error.message && event.error.message.toLowerCase().includes("dynamic")) {
                window.location.reload();
                event.preventDefault();
            }
        });

        window.addEventListener("unhandledrejection", (event) => {
            if (
                event.reason &&
                event.reason.message &&
                event.reason.message.toLowerCase().includes("dynamic")
            ) {
                window.location.reload();
                event.preventDefault();
            }
        });
    };

    static getDerivedStateFromError(_: Error): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error) {
        console.error(error);

        if (error.message.toLowerCase().includes("dynamic")) {
            window.location.reload();
        }
    }

    componentWillUnmount() {
        window.removeEventListener("error", () => {});
        window.removeEventListener("unhandledrejection", () => {});
    }

    render() {
        if (this.state.hasError) {
            return <Error />;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
