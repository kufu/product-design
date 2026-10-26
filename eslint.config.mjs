import js from '@eslint/js'
import globals from 'globals'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import astroPlugin from 'eslint-plugin-astro'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist/', '.astro/']),

  js.configs.recommended,
  tsPlugin.configs['flat/recommended'],
  astroPlugin.configs['flat/recommended'],

  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },

      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },

  {
    // Node上で実行される設定ファイル類
    files: ['*.js', '*.cjs', '*.mjs'],

    languageOptions: {
      globals: {
        ...globals.node,
      },
    },

    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
])
