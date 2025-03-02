import type { Options } from "tsup";
import { defineConfig } from "tsup";

const baseOptions: Options = {
  minify: false,
  sourcemap: true,
  dts: true,
  clean: true,
  target: "es2020",
  external: ["react"],
  format: ["esm", "cjs"],
};

export default defineConfig([
  {
    ...baseOptions,
    entryPoints: ["src/index.ts"],
    outDir: "dist",
  },
]);
