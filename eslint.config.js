const js = require('@eslint/js')
const globals = require('globals')
const tsPlugin = require('@typescript-eslint/eslint-plugin')
const astroPlugin = require('eslint-plugin-astro')

const { defineConfig, globalIgnores } = require('eslint/config')

module.exports = defineConfig([
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
