import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // VPS では subdomain 直下に置くのでルート配信にする。
  base: "/",
});
