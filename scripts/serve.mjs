import { readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { buildAndWatch } from './watch.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const OUT_DIR = path.join(root, 'dist')
const PORT = Number(process.env.PORT ?? 1234)
const WATCH = process.argv.includes('--watch')

const CONTENT_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
}

/** URLのパスに対応するdist/配下のファイルを読む。ディレクトリならその中のindex.htmlを読む */
const readAsset = async (pathname) => {
  const file = path.join(OUT_DIR, pathname)

  // パストラバーサル（`/../secret`）でdist/の外を指しているか。先頭の階層が`..`なら外に出ている
  if (path.relative(OUT_DIR, file).split(path.sep)[0] === '..') return undefined

  for (const f of [file, path.join(file, 'index.html')]) {
    // 存在しない・ディレクトリだった場合はundefinedになるので、次の候補を試す
    const body = await readFile(f).catch(() => undefined)

    // 存在する時のみ返す
    if (body) return { body, ext: path.extname(f) }
  }

  return undefined
}

const sendAsset = (response, status, asset) => {
  response.writeHead(status, {
    'content-type': CONTENT_TYPES[asset?.ext] ?? 'application/octet-stream',
    'cache-control': 'no-store',
  })
  response.end(asset?.body)
}

const server = createServer(async (request, response) => {
  try {
    const { pathname } = new URL(request.url, `http://localhost:${PORT}`)
    const asset = await readAsset(decodeURIComponent(pathname))

    if (asset) {
      sendAsset(response, 200, asset)
    } else {
      sendAsset(response, 404, await readAsset('/404.html'))
    }
  } catch (error) {
    // 壊れたURL（`/%` など）でサーバーを落とさない
    const status = error instanceof URIError ? 400 : 500

    console.error(`${status} ${request.url}: ${error.message}`)
    response.writeHead(status, { 'content-type': 'text/plain; charset=utf-8' })
    response.end(status === 400 ? 'Bad Request' : 'Internal Server Error')
  }
})

server.on('error', (error) => {
  if (error.code !== 'EADDRINUSE') throw error

  console.error(`ポート${PORT}は使用中です。PORT=2345 pnpm dev のように別のポートを指定してください。`)
  process.exit(1)
})

if (WATCH) await buildAndWatch()

server.listen(PORT, 'localhost', () => console.log(`http://localhost:${PORT}/`))
