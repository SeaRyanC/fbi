import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/web/index.tsx"],
  bundle: true,
  outfile: "docs/bundle.js",
  format: "esm",
  target: "es2020",
  minify: true,
  sourcemap: true,
  jsx: "automatic",
  jsxImportSource: "preact",
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  alias: {
    "react": "preact/compat",
    "react-dom": "preact/compat",
  },
});

console.log("Build complete: docs/bundle.js");
