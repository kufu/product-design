const { defineConfig } = require('eslint/config')

const parser = require('astro-eslint-parser')
const js = require('@eslint/js')

const { FlatCompat } = require('@eslint/eslintrc')

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

module.exports = defineConfig([
  {
    extends: compat.extends('plugin:astro/recommended'),
  },
  {
    files: ['**/*.astro'],

    languageOptions: {
      parser: parser,

      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
    },

    rules: {},
  },
])
