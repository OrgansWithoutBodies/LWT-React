// electron.vite.config.ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "electron-vite";
import path from "path";
var __electron_vite_injected_dirname = "/home/v/Projects/LWT-React";
var electron_vite_config_default = defineConfig({
  main: {
    resolve: {
      alias: {
        // Your other aliases if you have some
        "mock-aws-s3": path.resolve(__electron_vite_injected_dirname, "src/main/empty.ts"),
        "aws-sdk": path.resolve(__electron_vite_injected_dirname, "src/main/empty.ts"),
        nock: path.resolve(__electron_vite_injected_dirname, "src/main/empty.ts")
      }
    }
  },
  preload: {},
  renderer: {
    plugins: [react()],
    define: {
      "process.env": process.env
    }
  }
});
export {
  electron_vite_config_default as default
};
