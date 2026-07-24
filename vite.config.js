import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (/[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/.test(id)) return "react";
          if (/[\\/]node_modules[\\/](@reduxjs[\\/]toolkit|react-redux)[\\/]/.test(id)) return "redux";
          if (/[\\/]node_modules[\\/](axios|lucide-react|react-hook-form|react-toastify)[\\/]/.test(id)) {
            return "vendor";
          }
          return "vendor-misc";
        }
      }
    }
  },
  server: {
    port: 5173
  }
});
