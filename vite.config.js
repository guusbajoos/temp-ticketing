import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import PluginJSConfigPath from "vite-jsconfig-paths";
import PluginDyanmicImport from "vite-plugin-dynamic-import";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 4001,
  },
  plugins: [react(), PluginJSConfigPath(), PluginDyanmicImport(), svgr()],
  css: {
    preprocessorOptions: {
      sass: {
        javascriptEnabled: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1600,
    outDir: "build",
  },
});
