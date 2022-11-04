# Product Design Wiki

## 実行コマンド

yarn を推奨していますが、npm コマンドの利用も可能です。

| Command             | Action                                           |
| :------------------ | :----------------------------------------------- |
| `yarn install`      | Installs dependencies                            |
| `yarn dev`          | Starts local dev server at `localhost:3000`      |
| `yarn build`        | Build your production site to `./dist/`          |
| `yarn preview`      | Preview your build locally, before deploying     |
| `yarn astro ...`    | Run CLI commands like `astro add`, `astro check` |
| `yarn astro --help` | Get help using the Astro CLI                     |

## ディレクトリ構造

```
/
├── public/
├── src/
│   └── layouts/
│   └── pages/
│       └── documents/
│           └── *.md
│       └── index.astro
└── package.json
```

## [WIP]用語の追加方法

- ドキュメント追加用ブランチを作成。
- `src/pages/documents`配下に、`_template.md`を参考に Markdown ファイルを作成。
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
