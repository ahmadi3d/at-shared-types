import { defineConfig } from "tsup";

export default defineConfig({
    entry: {
        index: "src/index.ts",
        domain: "src/domain.ts",
        transport: "src/transport.ts"
    },
    format: ["esm", "cjs"],
    sourcemap: true,
    target: "es2020",
    outDir: "dist",
    dts: false,
    outExtension({ format }) {
        return { js: format === "esm" ? ".mjs" : ".cjs" };
    }
});
