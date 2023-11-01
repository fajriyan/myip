import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import cloudflare from "solid-start-cloudflare-pages";

export default defineConfig({
  plugins: [solid({ adapter: cloudflare({}) })],
});
