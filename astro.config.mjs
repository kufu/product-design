import { defineConfig } from 'astro/config'
import compress from 'astro-compress'
import replacePageLink from './src/plugins/replacePageLink'

// https://astro.build/config
export default defineConfig({
  markdown: {
    extendDefaultPlugins: true,
    remarkPlugins: [replacePageLink],
  },
  integrations: [compress()],
  trailingSlash: 'always',
  site: 'https://product-design.jp',
})
