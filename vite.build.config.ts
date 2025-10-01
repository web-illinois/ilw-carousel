import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    root: "src",
    build: {
        outDir: "../dist/cdn",
        lib: {
            name: "ilw-carousel",
            entry: "ilw-carousel.ts",
            fileName: "ilw-carousel",
            formats: ["es"],
        },
    },
    server: {
        hmr: false,
    },
});
