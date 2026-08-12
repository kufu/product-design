import { readFileSync } from 'node:fs'

import { escapeHtml as esc } from './markdown.mjs'

export const SITE = 'https://product-design.jp'

const SITE_NAME = 'Product Design Wiki'
const MAX_DESCRIPTION_LENGTH = 120

const style = readFileSync(new URL('../src/css/style.css', import.meta.url), 'utf-8')

/**
 * 全ページ共通のレイアウト。
 * headerは<body>直下、contentはその下に差し込まれる。
 */
export const baseLayout = ({ pathname, title, description, author, ogimage, header = '', content }) => {
  const canonicalUrl = `${SITE}${pathname}`
  const isChildPage = pathname.split('/').length > 3
  const pageTitle = `${title}${isChildPage ? ` | ${SITE_NAME}` : ''}`
  const pageDescription = `${description.substring(0, MAX_DESCRIPTION_LENGTH)}${
    description.length > MAX_DESCRIPTION_LENGTH ? '...' : ''
  }`
  const ogimageUrl = `${SITE}/${ogimage ?? 'ogimage_wiki.png'}`

  return `<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <title>${esc(pageTitle)}</title>
    <link rel="canonical" href="${esc(canonicalUrl)}" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="creator" content="株式会社SmartHR" />
    <meta name="description" content="${esc(pageDescription)}" />
    ${author ? `<meta name="author" content="${esc(author)}" />` : ''}
    <meta property="og:url" content="${esc(canonicalUrl)}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${esc(pageTitle)}" />
    <meta property="og:description" content="${esc(pageDescription)}" />
    <meta property="og:image" content="${esc(ogimageUrl)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${esc(pageTitle)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@SmartHR_jp" />
    <meta name="twitter:creator" content="@SmartHR_jp" />
    <meta name="twitter:title" content="${esc(pageTitle)}" />
    <meta name="twitter:description" content="${esc(pageDescription)}" />
    <meta name="twitter:image" content="${esc(ogimageUrl)}" />
    <style>${style}</style>
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
`
}

/** 用語・コラムの記事ページ */
export const articlePage = ({ pathname, frontmatter, description, html }) =>
  baseLayout({
    pathname,
    title: frontmatter.title,
    description,
    author: frontmatter.author,
    header: `    <header>
      <a href="/">TOPへ戻る</a>
    </header>`,
    content: `    <main>
      <article>
        <header>
          <h1>${esc(frontmatter.title)}</h1>
        </header>
${html}
${
  frontmatter.author
    ? `        <dl>
          <dt>著者</dt>
          <dd>${esc(frontmatter.author)}</dd>
        </dl>`
    : ''
}
      </article>
    </main>`,
  })

const indexList = (documents) => `      <ul>
${documents.map((document) => `        <li><a href="${document.pathname}">${esc(document.frontmatter.title)}</a></li>`).join('\n')}
      </ul>`

/** トップページ */
export const homePage = ({ words, columns }) =>
  baseLayout({
    pathname: '/',
    title: SITE_NAME,
    description:
      'Product Design Wikiでは、プロダクトデザイングループ内で獲得した知見、スキル定義、学習コンテンツを掲載しています。プロダクトデザインに関わる人はどなたでも利用・参加できます。',
    ogimage: 'ogimage_wiki.png',
    content: `    <header>
      <h1>${SITE_NAME}</h1>
      <p>
        Product Design Wikiへようこそ。SmartHR
        プロダクトデザイングループ内で獲得した知見、スキル定義、学習コンテンツを掲載しています。プロダクトデザインに関わる人はどなたでも利用・参加できます。
      </p>
    </header>
    <section>
      <header>
        <h2>用語</h2>
        <p>プロダクトデザイングループ内で整理した用語を掲載しています。</p>
      </header>
${indexList(words)}
    </section>
    <section>
      <header>
        <h2>コラム</h2>
        <p>SmartHRに所属するプロダクトデザイナーが書いたコラムを掲載しています。</p>
      </header>
${indexList(columns)}
    </section>
    <section>
      <h2><a href="/skills/">スキル定義</a></h2>
      <p>SmartHRではプロダクトデザイナーが必要とされる技能をスキルとして定義しています。</p>
    </section>`,
  })

/** スキル定義ページ */
export const skillsPage = ({ skills }) =>
  baseLayout({
    pathname: '/skills/',
    title: `スキル定義 | ${SITE_NAME}`,
    description:
      'SmartHRではプロダクトデザイナーに必要とされる技能をスキルとして定義しています。各スキルを5段階で定義しています。',
    header: `    <header>
      <a href="/">Product Design Wiki TOPへ戻る</a>
      <h1>スキル定義</h1>
      <p>
        SmartHRではプロダクトデザイナーに必要とされる技能をスキルとして定義しています。
        例として「SmartHRでのドメイン知識の例」を含めていますが、デジタルプロダクトデザインにおいて汎用的な技能を網羅しています。
      </p>
    </header>`,
    content: `    <section>
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
${skills
  .map(
    (skill) => `      <div>
        <h3>${esc(skill.label)}</h3>
${skill.description ? `        <p>${esc(skill.description)}</p>` : ''}
        <ul>
${skill.levels
  .map(
    (level, levelNumber) => `          <li>
            レベル${levelNumber + 1}
            <ul>
              <li>${esc(level)}</li>
            </ul>
          </li>`,
  )
  .join('\n')}
        </ul>
      </div>`,
  )
  .join('\n')}
    </section>`,
  })

/** 404ページ */
export const notFoundPage = () =>
  baseLayout({
    pathname: '/404/',
    title: `404 Page Not Found | ${SITE_NAME}`,
    description:
      '申し訳ありませんが、お探しのページは見つかりませんでした。お手数ですが、URLを確認してもう一度アクセスしてください。',
    header: `    <header>
      <a href="/">Product Design</a>
    </header>`,
    content: `    <main>
      <article>
        <header>
          <h1>404 Page Not Found</h1>
        </header>
        <p>申し訳ありませんが、お探しのページは見つかりませんでした。お手数ですが、URLを確認してもう一度アクセスしてください。</p>
      </article>
    </main>`,
  })
