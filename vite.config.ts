import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: ["all"],
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
    allowedHosts: [
      "all",
      ".railway.app",
      ".up.railway.app",
      "frontend-backoffice-fature-production-3f50.up.railway.app",
      "localhost",
      "127.0.0.1"
    ],
  },
})

