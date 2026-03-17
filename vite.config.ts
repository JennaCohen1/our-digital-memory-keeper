import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import pkg from "./package.json";

const buildHash = Date.now().toString(36);

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __BUILD_HASH__: JSON.stringify(buildHash),
  },
  plugins: [
    react(),
    {
      name: "generate-version-json",
      buildStart() {
        fs.writeFileSync(
          path.resolve(__dirname, "public/version.json"),
          JSON.stringify({ version: pkg.version, buildHash })
        );
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
