import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/register": "http://localhost:5000",
            "/login": "http://localhost:5000",
            "/courses": "http://localhost:5000",
            "/api": "http://localhost:5000",
            "/enroll": "http://localhost:5000",
            "/my-courses": "http://localhost:5000",
            "/users": "http://localhost:5000",
            "/analytics": "http://localhost:5000"
        }
    }
});
