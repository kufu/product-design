import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  markdown: {
    extendDefaultPlugins: true,
    remarkPlugins: [],
  },
})
