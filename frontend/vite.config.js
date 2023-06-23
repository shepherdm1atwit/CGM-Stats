import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
   host: true,
   port: 9090,
    watch: {
      usePolling: true
    }
  },
  define: {
    'process.env': process.env
  }
})