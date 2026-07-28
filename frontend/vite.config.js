import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// The backend (Express) is expected to run on port 3000.
// Requests to /api are proxied there during development.
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            "/api": {
                target: "http://localhost:3000",
                changeOrigin: true,
            },
        },
    },
});
