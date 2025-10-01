import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
    root: "src",
    build: {
        outDir: "../dist",
        lib: {
            name: "ilw-carousel",
            entry: "ilw-carousel.ts",
            fileName: "ilw-carousel",
            formats: ["es"],
        },
        rollupOptions: {
            external: [/^@?lit/, /^@illinois-toolkit/],
        },
    },
    server: {
        hmr: false,
    },
    plugins: [dts()],
});
