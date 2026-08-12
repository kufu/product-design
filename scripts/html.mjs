const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }

/** HTMLエスケープ。テキストと属性値の両方に使う */
export const escapeHtml = (value) => String(value).replace(/[&<>"]/g, (character) => HTML_ESCAPES[character])

/** エスケープ済みのHTMLであることを示す印 */
class SafeHtml {
  constructor(value) {
    this.value = value
  }

  toString() {
    return this.value
  }
}

/**
 * 組み立て済みのHTML文字列をそのまま埋め込む。
 * Markdownの変換結果やCSSのように、エスケープしてはいけない値に使う。
 */
export const raw = (value) => new SafeHtml(value)

const render = (value) => {
  if (value === null || value === undefined || value === false) return ''
  if (value instanceof SafeHtml) return value.value
  if (Array.isArray(value)) return value.map(render).join('\n')

  return escapeHtml(value)
}

/**
 * HTMLを組み立てるテンプレートリテラル。
 * - 埋め込んだ値は既定でエスケープする（`raw()` を通したものだけ素通し）
 * - 配列は改行で連結するので `.join('\n')` を書かなくてよい
 * - `null` `undefined` `false` は空文字になるので `cond && html\`...\`` が書ける
 */
export const html = (strings, ...values) =>
  raw(strings.reduce((out, string, index) => out + render(values[index - 1]) + string))
