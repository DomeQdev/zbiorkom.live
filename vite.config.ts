import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    base: "/",
    plugins: [
        react(),
        tsconfigPaths(),
    ],
    server: {
        open: true,
        port: 3000,
    },
    build: {
        sourcemap: false,
        minify: "terser",
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
