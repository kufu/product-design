import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { createMarkdownRenderer, excerpt, parseFrontmatter } from './markdown.mjs'
import { articlePage, homePage, notFoundPage, skillsPage } from './templates.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))

const SRC_DIR = path.join(root, 'src')
const PAGES_DIR = path.join(SRC_DIR, 'pages')
const OUT_DIR = path.join(root, 'dist')

/**
 * `src/` 直下のうちビルドの入力として使うもの。
 * ここに挙げたもの以外はアセットとみなして `dist/` 直下へそのままコピーする。
 * （画像などを追加するときは `src/` に置くだけでよい）
 */
const BUILD_INPUTS = new Set(['pages', 'css', 'data'])

const isBuildInput = (file) => {
  const relative = path.relative(SRC_DIR, file)

  if (!relative) return false // src/ 自身はコピー対象

  return BUILD_INPUTS.has(relative.split(path.sep)[0]) || /\.(mjs|cjs|js)$/.test(relative)
}

/** `src/pages/<collection>/*.md` を読み込む。`_` 始まりのファイルは下書き扱いで除外する */
const readCollection = async (collection) => {
  const dir = path.join(PAGES_DIR, collection)
  const files = (await readdir(dir)).filter((file) => file.endsWith('.md') && !file.startsWith('_')).sort()

  return Promise.all(
    files.map(async (file) => {
      const slug = path.basename(file, '.md')
      const { frontmatter, body } = parseFrontmatter(await readFile(path.join(dir, file), 'utf-8'))

      return { pathname: `/${collection}/${slug}/`, frontmatter, body }
    }),
  )
}

const writePage = async (pathname, html) => {
  const file = path.join(OUT_DIR, pathname.replace(/^\//, ''))

  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(file, html)
}

const [words, columns, skills] = await Promise.all([
  readCollection('words'),
  readCollection('columns'),
  readFile(path.join(SRC_DIR, 'data/skills.json'), 'utf-8').then(JSON.parse),
])
const documents = [...words, ...columns]

// 独自記法 `:[タイトル]:` を解決するためのタイトル→URLの対応表
const pageMap = new Map(documents.map((document) => [document.frontmatter.title, document.pathname]))
const renderMarkdown = createMarkdownRenderer(pageMap)

const pages = [
  ...documents.map((document) => [
    `${document.pathname}index.html`,
    articlePage({
      pathname: document.pathname,
      frontmatter: document.frontmatter,
      description: document.frontmatter.description || excerpt(document.body),
      html: renderMarkdown(document.body),
    }),
  ]),
  ['/index.html', homePage({ words, columns })],
  ['/skills/index.html', skillsPage({ skills })],
  ['/404.html', notFoundPage()],
]

await rm(OUT_DIR, { recursive: true, force: true })

await Promise.all([
  ...pages.map(([pathname, html]) => writePage(pathname, html)),
  // src/ のアセット（画像・favicon・_redirects など）をdist直下へコピーする
  cp(SRC_DIR, OUT_DIR, {
    recursive: true,
    filter: (src) => !isBuildInput(src) && path.basename(src) !== '.DS_Store',
  }),
])

console.log(`built ${pages.length} pages -> dist/`)
