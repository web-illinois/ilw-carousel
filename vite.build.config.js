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
