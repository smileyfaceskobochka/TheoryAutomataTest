import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  vite: {
    base: process.env.NODE_ENV === 'production' ? '/TheoryAutomataTest/' : '/',
  },
});
