import { defineConfig } from 'astro/config'
import compress from 'astro-compress'
import vercel from '@astrojs/vercel/serverless'
import replacePageLink from './src/plugins/replacePageLink'

// https://astro.build/config
export default defineConfig({
  markdown: {
    extendDefaultPlugins: true,
    remarkPlugins: [replacePageLink],
  },
  integrations: [compress()],
  output: 'server',
  adapter: vercel(),
  trailingSlash: 'always',
})
