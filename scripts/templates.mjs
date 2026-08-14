import { readFileSync } from 'node:fs'

import { html, raw } from './html.mjs'

const SITE = 'https://product-design.jp'
const SITE_NAME = 'Product Design Wiki'
const OG_IMAGE_URL = `${SITE}/ogimage_wiki.png`
const MAX_DESCRIPTION_LENGTH = 120

const style = readFileSync(new URL('../src/css/style.css', import.meta.url), 'utf-8')

/** サイト名を添えたページタイトル。トップページ以外はこの形にする */
const withSiteName = (title) => `${title} | ${SITE_NAME}`

/** 長すぎる説明文を切り詰める */
const truncate = (text, max) => (text.length > max ? `${text.slice(0, max)}...` : text)

/**
 * 全ページ共通のレイアウト。
 * headerは<body>直下、contentはその下に差し込まれる。
 */
export const baseLayout = ({ pathname, title, description, author, header = '', content }) => {
  const canonicalUrl = `${SITE}${pathname}`
  const pageDescription = truncate(description, MAX_DESCRIPTION_LENGTH)

  return String(html`<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <link rel="canonical" href="${canonicalUrl}" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="creator" content="株式会社SmartHR" />
    <meta name="description" content="${pageDescription}" />
    ${author && html`<meta name="author" content="${author}" />`}
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${pageDescription}" />
    <meta property="og:image" content="${OG_IMAGE_URL}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${title}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@SmartHR_jp" />
    <meta name="twitter:creator" content="@SmartHR_jp" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${pageDescription}" />
    <meta name="twitter:image" content="${OG_IMAGE_URL}" />
    <style>${raw(style)}</style>
  </head>
  <body>
${header}
${content}
    <hr />
    <footer>
      <p>&copy; SmartHR, Inc.</p>
    </footer>
  </body>
</html>
`)
}

/** 用語・コラムの記事ページ。bodyはMarkdownを変換したHTML */
export const articlePage = ({ pathname, frontmatter, description, body }) =>
  baseLayout({
    pathname,
    title: withSiteName(frontmatter.title),
    description,
    author: frontmatter.author,
    header: html`    <header>
      <a href="/">TOPへ戻る</a>
    </header>`,
    content: html`    <main>
      <article>
        <header>
          <h1>${frontmatter.title}</h1>
        </header>
${raw(body)}
${
  frontmatter.author &&
  html`        <dl>
          <dt>著者</dt>
          <dd>${frontmatter.author}</dd>
        </dl>`
}
      </article>
    </main>`,
  })

/** トップページ。本文は `src/pages/index.md`（用語・コラムの一覧は `:list[words]:` 記法で差し込まれる） */
export const homePage = ({ frontmatter, body }) =>
  baseLayout({
    pathname: '/',
    title: frontmatter.title,
    description: frontmatter.description,
    content: html`    <header>
      <h1>${frontmatter.title}</h1>
    </header>
    <main>
${raw(body)}
    </main>`,
  })

const skillLevels = (levels) =>
  levels.map(
    (level, levelNumber) => html`          <li>
            レベル${levelNumber + 1}
            <ul>
              <li>${level}</li>
            </ul>
          </li>`,
  )

const skillList = (skills) =>
  skills.map(
    (skill) => html`      <div>
        <h3>${skill.label}</h3>
${skill.description && html`        <p>${skill.description}</p>`}
        <ul>
${skillLevels(skill.levels)}
        </ul>
      </div>`,
  )

/** スキル定義ページ */
export const skillsPage = ({ skills }) =>
  baseLayout({
    pathname: '/skills/',
    title: withSiteName('スキル定義'),
    description:
      'SmartHRではプロダクトデザイナーに必要とされる技能をスキルとして定義しています。各スキルを5段階で定義しています。',
    header: html`    <header>
      <a href="/">Product Design Wiki TOPへ戻る</a>
      <h1>スキル定義</h1>
      <p>
        SmartHRではプロダクトデザイナーに必要とされる技能をスキルとして定義しています。
        例として「SmartHRでのドメイン知識の例」を含めていますが、デジタルプロダクトデザインにおいて汎用的な技能を網羅しています。
      </p>
    </header>`,
    content: html`    <section>
      <h2>スキルレベル定義</h2>
      <p>各スキルはレベル1〜5の5段階で定義しています。</p>
      <ul>
        <li>レベル1：最低限できてほしいこと</li>
        <li>レベル2：仕事になること、自走できること</li>
        <li>レベル3：独り立ちし、周囲を率いれること</li>
        <li>レベル4：明らかに優れていること、社外に名前が知られていること</li>
        <li>レベル5：界隈に影響を与えていること、世界に誇れる人であること</li>
      </ul>
      <h2>スキル定義の運用</h2>
      <p>
        求められる技能は時代や環境の変化に依って代わりゆくため、スキル定義も合わせて見直していく必要があります。最低でも数年に1度は見直すと良いでしょう。
      </p>
      <p>
        何のためにスキル定義を作るのか、という目的も大切です。目的の薄いスキル定義は、その運用コストの高さからすぐに形骸化します。また「昔取った杵柄」で評価をしないために、1年触れていない技能は強制的に1段階下げるなどの工夫も必要でしょう。
      </p>
    </section>
    <section>
      <h2>スキル定義一覧</h2>
${skillList(skills)}
    </section>`,
  })

/** 404ページ。本文は `src/pages/404.md` */
export const notFoundPage = ({ frontmatter, body }) =>
  baseLayout({
    pathname: '/404/',
    title: withSiteName(frontmatter.title),
    description: frontmatter.description,
    header: html`    <header>
      <a href="/">Product Design</a>
    </header>`,
    content: html`    <main>
      <article>
        <header>
          <h1>${frontmatter.title}</h1>
        </header>
${raw(body)}
      </article>
    </main>`,
  })
