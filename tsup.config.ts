import { defineConfig } from "tsup";

export default defineConfig([
  // React component entry
  {
    entry: {
      react: "src/react.ts",
    },
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: true,
    external: ["react", "react-dom"],
    treeshake: true,
  },
  // Web component entry (Lit as peer dependency)
  {
    entry: {
      "web-component": "src/web-component.ts",
    },
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    external: ["lit"],
    treeshake: true,
  },
  // IIFE bundle for CDN (bundles everything including Lit)
  {
    entry: {
      "truncated-value.iife": "src/web-component.ts",
    },
    format: ["iife"],
    globalName: "TruncatedValue",
    minify: true,
    sourcemap: true,
    noExternal: ["lit"],
  },
]);
