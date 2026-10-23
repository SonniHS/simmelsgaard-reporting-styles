// Bundle the preview app (previews/main.tsx) with its CSS and self-hosted fonts into previews/dist/.
//   npm run previews        then open previews/index.html over http (fonts do not load from file://)
import { build } from "esbuild";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
await build({
  entryPoints: [path.join(root, "previews/main.tsx")],
  bundle: true,
  outdir: path.join(root, "previews/dist"),
  format: "iife",
  jsx: "automatic",
  loader: { ".woff2": "file", ".woff": "file" },
  assetNames: "fonts/[name]-[hash]",
  define: { "process.env.NODE_ENV": '"production"' },
  minify: true,
  logLevel: "warning",
});
console.log("ok: previews/dist written");
