import { crx } from "@crxjs/vite-plugin";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import manifest from "./manifest.json";
// import { optimizeImports } from "carbon-preprocess-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // https://stackoverflow.com/questions/69548571/svelte-carbon-component-import-breaks-debugging
    // svelte({preprocess: [optimizeImports()]}),
    svelte(), 
    crx({ manifest })],
});