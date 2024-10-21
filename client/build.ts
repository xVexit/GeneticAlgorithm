import { build, stop } from "https://deno.land/x/esbuild@v0.24.0/mod.js";

const ENTRY_PATH = `${Deno.cwd()}/client/src/main.ts`;
const BUILD_PATH = `${Deno.cwd()}/public/build`;

try {
    await build({
        entryPoints: [ENTRY_PATH],
        outdir: BUILD_PATH,
        bundle: true,
        platform: "browser",
    });
    console.log("✔ Build completed:", BUILD_PATH);
} catch (error) {
    console.error(error);
} finally {
    await stop();
}
