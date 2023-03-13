import { defineConfig } from 'astro/config';
import compress from 'astro-compress';
import vercel from '@astrojs/vercel/serverless';
import replacePageLink from './src/plugins/replacePageLink';

// https://astro.build/config
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  markdown: {
    extendDefaultPlugins: true,
    remarkPlugins: [replacePageLink]
  },
  integrations: [compress(), react()],
  output: 'server',
  adapter: vercel()
});