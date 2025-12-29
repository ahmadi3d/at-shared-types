import { readdirSync, statSync, renameSync, mkdirSync, writeFileSync, copyFileSync } from "node:fs";
import { join, extname, relative, dirname } from "node:path";

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

// --- new: ensure root d.ts exists so JS/CJS consumers get IntelliSense ---
try {
  // prefer the ESM d.ts (tsc writes declaration files next to ESM output)
  copyFileSync("dist/esm/index.d.ts", "dist/index.d.ts");
} catch (err) {
  // fallback: try cjs d.ts (if produced there)
  try { copyFileSync("dist/cjs/index.d.ts", "dist/index.d.ts"); } catch (e) { /* ignore */ }
}

// Mirror all .d.ts from dist/esm into dist/ preserving relative paths
function copyDtsToRoot() {
    const srcRoot = "dist/esm";
    try {
        const all = walk(srcRoot);
        for (const file of all) {
            if (!file.endsWith('.d.ts')) continue;
            const rel = relative(srcRoot, file);
            const dest = join("dist", rel);
            const destDir = dirname(dest);
            mkdirSync(destDir, { recursive: true });
            copyFileSync(file, dest);
        }
    } catch (e) {
        // non-fatal
    }
}

copyDtsToRoot();
