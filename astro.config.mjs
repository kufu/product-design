import { defineConfig } from 'astro/config'
import { unified } from '@astrojs/markdown-remark'
import compress from 'astro-compress'
import replacePageLink from './src/plugins/replacePageLink'

// https://astro.build/config
export default defineConfig({
  markdown: {
    processor: unified({
      remarkPlugins: [replacePageLink],
    }),
  },
  integrations: [compress()],
  trailingSlash: 'always',
  site: 'https://product-design.jp',
})
