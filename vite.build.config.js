import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    root: "src",
    build: {
        outDir: "../dist",
        lib: {
            name: "ilw-carousel",
            entry: "ilw-carousel.js",
            fileName: "ilw-carousel",
            formats: ["es", "cjs", "umd"],
        },
        rollupOptions: {
            output: {
                assetFileNames: (chunkInfo) => {
                    if (chunkInfo.name === "style.css") return "ilw-carousel.css";
                },
            },
        },
    },
    server: {
        hmr: false,
    },
});
