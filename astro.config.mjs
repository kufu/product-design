import { defineConfig } from 'astro/config'
import replacePageLink from './src/plugins/replacePageLink'

// https://astro.build/config
import compress from 'astro-compress'

// https://astro.build/config
export default defineConfig({
  markdown: {
    extendDefaultPlugins: true,
    remarkPlugins: [replacePageLink],
  },
  integrations: [compress()],
})
