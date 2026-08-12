# Product Design Wiki

## 概要

Product Design Wiki へようこそ。SmartHR プロダクトデザイングループ内で獲得した知見、スキル定義、学習コンテンツを掲載しています。プロダクトデザインに関わる人はどなたでも利用・参加できます。

https://product-design.jp/

## 実行コマンド

pnpm を推奨していますが、npm コマンドの利用も可能です。

| Command        | Action                                       |
| :------------- | :------------------------------------------- |
| `pnpm install` | Installs dependencies                        |
| `pnpm dev`     | Starts local dev server at `localhost:1234`  |
| `pnpm build`   | Build your production site to `./dist/`      |
| `pnpm preview` | Preview your build locally, before deploying |
| `pnpm lint`    | Syntax check for build scripts               |

ポートを変えたい場合は `PORT=2345 pnpm dev` のように指定します。
`pnpm dev` は `src/` の変更を検知して再ビルドしますが、ブラウザの自動リロードはしないため手動でリロードしてください。

## ディレクトリ構造

```
/
├── scripts/
│   ├── build.mjs       # ビルドスクリプト（dist/ を生成する）
│   ├── serve.mjs       # dev/preview 用の静的サーバー
│   ├── markdown.mjs    # Markdown・frontmatter の変換
│   └── templates.mjs   # 各ページのHTMLテンプレート
├── src/
│   ├── pages/          # ページになる Markdown
│   │   ├── columns/
│   │   │   └── *.md
│   │   └── words/
│   │       └── *.md
│   ├── css/            # style.css（HTMLに埋め込まれる）
│   ├── data/           # skills.json
│   ├── images/         # ここから下はアセット。dist/ 直下にコピーされる
│   ├── favicon.ico
│   ├── ogimage_wiki.png
│   └── _redirects      # Cloudflare Pages のリダイレクト設定
└── package.json
```

## ビルドのしくみ

`node scripts/build.mjs` だけで完結する静的サイトジェネレーターです。フレームワークは使っていません。

- `src/pages/{words,columns}/*.md` を読み、`dist/{words,columns}/<ファイル名>/index.html` を書き出す
- `_` で始まる Markdown（`_template.md` など）は公開されない
- トップページ・スキル定義・404 ページは `scripts/templates.mjs` の関数がHTMLを組み立てる
- `src/css/style.css` は各ページの `<style>` に埋め込まれる
- `src/` のうち `pages/` `css/` `data/` と `.mjs` 以外はアセットとみなし、`dist/` 直下へそのままコピーされる（`src/images/foo.png` → `/images/foo.png`）。画像を追加するときは `src/` 配下に置くだけでよく、`scripts/build.mjs` を編集する必要はない
- Markdown の変換には [marked](https://marked.js.org/) を利用

依存パッケージは marked 1つだけです。Lint・整形ツールは置いていないため、書式は `.editorconfig` に従ってください。
## Product Design Wiki
### [WIP]用語の追加方法

- ドキュメント追加用ブランチを作成。
- `src/pages/{words, columns}`配下に、`_template.md`を参考に Markdown ファイルを作成。
- ドキュメントを書く。
- `main`ブランチへの Pull Request を作ってメンバーにレビューしてもらう。
- レビュー完了後`main`ブランチへマージ。

## 独自Markdown記法

Product Design Wikiではドキュメントの利便性を高めるための記法を用意しています。

### ページ内リンク

以下の記法で書いた場合、ドキュメント内のタイトルがサイト内のタイトルに一致する用語があれば、該当ページへ遷移します。

```
このリンクは:[タイトル]:へ遷移します。
```
