// vite.config.ts
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  root: "src/browser",
  build: {
    outDir: "../../dist/browser",
    emptyOutDir: true,
    target: "esnext",
    modulePreload: { polyfill: false },
    rollupOptions: {
      input: path.resolve(__dirname, "src/browser/main.ts"),
    },
  },
  resolve: {
    alias: {
      "effects-vdom": path.resolve(__dirname, "../../dist/index.js"),
    },
  },
});
