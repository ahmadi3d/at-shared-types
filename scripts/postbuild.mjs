import { readdirSync, statSync, renameSync, mkdirSync, writeFileSync } from "node:fs";
import { join, extname } from "node:path";

function walk(dir) {
    const out = [];
    for (const entry of readdirSync(dir)) {
        const p = join(dir, entry);
        const s = statSync(p);
        if (s.isDirectory()) out.push(...walk(p));
        else out.push(p);
    }
    return out;
}

function renameExt(rootDir, fromExt, toExt) {
    for (const file of walk(rootDir)) {
        if (extname(file) === fromExt) {
            renameSync(file, file.slice(0, -fromExt.length) + toExt);
        }
    }
}

// Ensure folders exist
mkdirSync("dist/esm", { recursive: true });
mkdirSync("dist/cjs", { recursive: true });

// Rename output JS files
renameExt("dist/esm", ".js", ".mjs");
renameExt("dist/cjs", ".js", ".cjs");

// Optional: keep runtime mode explicit for tools that care
writeFileSync("dist/esm/package.json", JSON.stringify({ type: "module" }, null, 2));
writeFileSync("dist/cjs/package.json", JSON.stringify({ type: "commonjs" }, null, 2));
