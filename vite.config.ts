import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import istanbul from "vite-plugin-istanbul";
export default defineConfig({
  plugins: [
    react(),
    istanbul({
      include: "src/*",
      exclude: ["**/node_modules/**"],
      extension: [".ts", ".tsx"],
      requireEnv: false,
    }),
  ],
  css: {
    modules: {
      scopeBehaviour: "global",
    },
  },
  server: {
    port: 4000,
  },
  preview: {
    port: 4000,
  },
});
