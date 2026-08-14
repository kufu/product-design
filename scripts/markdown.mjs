import { Marked } from 'marked'

import { escapeHtml } from './html.mjs'

/**
 * frontmatterと本文を分離する。
 * `key: value` を1行ずつ書く単純な形式のみを対象にしている。
 */
export const parseFrontmatter = (source) => {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source)

  if (!match) return { frontmatter: {}, body: source }

  const frontmatter = {}

  for (const line of match[1].split(/\r?\n/)) {
    const field = /^([\w-]+)\s*:\s*(.*)$/.exec(line)

    if (field) frontmatter[field[1]] = field[2].trim().replace(/^(['"])(.*)\1$/, '$2')
  }

  return { frontmatter, body: source.slice(match[0].length) }
}

/** 見出しのid用。日本語をそのまま残し、記号だけを落とす */
const slugify = (text) =>
  text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}\-_]/gu, '')

/** 同一ページ内で見出しidが重複したら連番を付ける */
const createSlugger = () => {
  const used = new Map()

  return (text) => {
    const base = slugify(text)
    const count = used.get(base) ?? 0

    used.set(base, count + 1)

    return count === 0 ? base : `${base}-${count}`
  }
}

/**
 * 独自記法 `:[タイトル]:` をサイト内リンクに変換するmarked拡張。
 * タイトルが見つからない場合は404ページへ送る。
 */
const pageLinkExtension = (pageMap) => ({
  name: 'pageLink',
  level: 'inline',
  start: (src) => src.indexOf(':['),
  tokenizer(src) {
    const match = /^:\[(.+?)\]:/.exec(src)

    if (!match) return undefined

    return { type: 'pageLink', raw: match[0], title: match[1] }
  },
  renderer: (token) =>
    `<a href="${escapeHtml(pageMap.get(token.title) ?? '/404/')}">${escapeHtml(token.title)}</a>`,
})

/** 引用符と三点リーダーを約物に置き換える（旧: Astroのsmartypants相当） */
const smartypants = (text) =>
  text
    .replace(/\.{3}/g, '…')
    .replace(/(^|[\s([{<「『（【〈《])"/g, '$1“')
    .replace(/"/g, '”')
    .replace(/(^|[\s([{<「『（【〈《])'/g, '$1‘')
    .replace(/'/g, '’')

/**
 * Markdown本文をHTMLに変換する。
 * pageMapは `:[タイトル]:` 記法の解決に使うタイトル→URLの対応表。
 * 見出しidの重複判定はページごとに独立させたいので、呼び出しごとにインスタンスを作る。
 */
export const renderMarkdown = (body, pageMap) => {
  const slug = createSlugger()

  const marked = new Marked({
    extensions: [pageLinkExtension(pageMap)],
    // 生HTMLやコード、リンクのURLには手を入れず、地の文だけを対象にする
    walkTokens: (token) => {
      if (token.type === 'text') token.text = smartypants(token.text)
    },
    renderer: {
      heading(token) {
        const content = this.parser.parseInline(token.tokens)
        // 見出し内のリンクや強調はidに含めない（`## [スキル定義](/skills/)` → `id="スキル定義"`）
        const label = content.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/g, '')

        return `<h${token.depth} id="${escapeHtml(slug(label))}">${content}</h${token.depth}>\n`
      },
    },
  })

  return marked.parse(body)
}

/**
 * frontmatterにdescriptionがない記事のために本文から抜粋を作る。
 * Markdownの記号を落として1行に詰める。長さの調整はテンプレート側が行う。
 */
export const excerpt = (body) =>
  body
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[>\-*+]\s*/gm, '')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/:\[(.+?)\]:/g, '$1')
    .replace(/[*_`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
