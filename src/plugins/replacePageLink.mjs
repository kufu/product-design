import { visit } from 'unist-util-visit'
import { glob } from 'glob'
import { readFileSync } from 'fs'

// ページのタイトルとURLのマッピングを作成
let pageMap = null

async function createPageMap() {
  if (pageMap) return pageMap

  pageMap = new Map()

  // words と columns のファイルを取得
  const wordFiles = await glob('src/pages/words/[!_]*.{md,mdx}')
  const columnFiles = await glob('src/pages/columns/[!_]*.{md,mdx}')

  const allFiles = [...wordFiles, ...columnFiles]

  for (const file of allFiles) {
    const content = readFileSync(file, 'utf-8')
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)

    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1]
      const titleMatch = frontmatter.match(/^title:\s*(.+)$/m)

      if (titleMatch) {
        const title = titleMatch[1].trim()
        // ファイルパスからURLを生成
        const url = file.replace('src/pages', '').replace(/\.(md|mdx)$/, '/')

        pageMap.set(title, url)
      }
    }
  }

  return pageMap
}

export default function replacePageLink() {
  return async function (tree) {
    const map = await createPageMap()

    visit(tree, 'text', (node) => {
      const { value } = node

      if (/:\[(.+?)\]:/.test(value)) {
        const replaceValue = value.replace(/:\[(.+?)\]:/g, (_, title) => {
          const url = map.get(title)
          return `<a href="${url || '/404/'}">${title}</a>`
        })

        node.type = 'html'
        node.value = replaceValue
      }
    })
  }
}
