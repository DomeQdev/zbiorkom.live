import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import { version } from "./package.json";
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    base: "/",
    plugins: [react(), tsconfigPaths()],
    define: {
        "import.meta.env.VITE_APP_VERSION": JSON.stringify(version),
    },
    server: {
        open: true,
        port: 3000,
    },
    build: {
        sourcemap: false,
        minify: "terser",
        target: "es2020",
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    if (id.includes("icons-material")) return "icons";
                    if (id.includes("use")) return "hooks";
                },
            },
        },
    },
    resolve: {
        alias: { "@": resolve(__dirname, "src/components") },
    },
});
