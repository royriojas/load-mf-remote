import { resolve } from "path";

import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";

import config from "./package.json";

export default defineConfig({
  plugins: [dts({ entryRoot: resolve(__dirname, "src") }), tsconfigPaths()],
  assetsInclude: ["**/*.woff2"],
  build: {
    sourcemap: true,
    lib: {
      entry: [resolve(__dirname, "src/index.ts")],
      name: "load-mf-remote",
      fileName: "load-mf-remote",
    },
    rollupOptions: {
      external: [...Object.keys(config.dependencies)],
      output: {},
    },
  },
});
