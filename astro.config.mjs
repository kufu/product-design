import { defineConfig } from 'astro/config'
import replacePageLink from './plugins/replacePageLink'

// https://astro.build/config
export default defineConfig({
  markdown: {
    extendDefaultPlugins: true,
    remarkPlugins: [replacePageLink],
  },
})
