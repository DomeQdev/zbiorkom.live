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
    },
    resolve: {
        alias: {
            "@root": resolve(__dirname, "src"),
            "@": resolve(__dirname, "src/components"),
            "@hooks": resolve(__dirname, "src/components/hooks"),
            "@map": resolve(__dirname, "src/components/map"),
            "@pages": resolve(__dirname, "src/components/pages"),
            "@redux": resolve(__dirname, "src/components/redux"),
            "@sheet": resolve(__dirname, "src/components/sheet"),
            "@translations": resolve(__dirname, "src/components/translations"),
            "@ui": resolve(__dirname, "src/components/ui"),
            "@util": resolve(__dirname, "src/components/util"),
        },
    },
});
