import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    clearMocks: true,
    setupFiles: ["./setupTests.ts"],
    environment: "jsdom",
    exclude: ["e2e", "node_modules"],
    coverage: {
      exclude: [
        "**/src/infrastructure/generated/**",
        "**/src/shared/components/**",
        ".next",
        "eslint.config.mjs",
        "playwright.config.ts",
        "postcss.config.mjs",
        "vitest.config.ts",
        "next-env.d.ts",
        "next.config.ts",
      ],
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
