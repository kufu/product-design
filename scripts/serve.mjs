import { spawn } from 'node:child_process'
import { watch } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SCRIPTS_DIR = fileURLToPath(new URL('.', import.meta.url))
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

/** dist配下のファイルを返す。ディレクトリならindex.htmlにフォールバックする */
const readAsset = async (pathname) => {
  const candidates = pathname.endsWith('/') ? [path.join(pathname, 'index.html')] : [pathname, path.join(pathname, 'index.html')]

  for (const candidate of candidates) {
    const file = path.join(OUT_DIR, path.normalize(candidate))

    // distの外を指すパスは拒否する
    if (!file.startsWith(OUT_DIR + path.sep)) return undefined

    try {
      return { body: await readFile(file), ext: path.extname(file) }
    } catch {
      continue
    }
  }

  return undefined
}

const server = createServer(async (request, response) => {
  try {
    const { pathname } = new URL(request.url, `http://localhost:${PORT}`)
    const asset = await readAsset(decodeURIComponent(pathname))
    const served = asset ?? (await readAsset('/404.html'))

    response.writeHead(asset ? 200 : 404, {
      'content-type': CONTENT_TYPES[served?.ext] ?? 'application/octet-stream',
      'cache-control': 'no-store',
    })
    response.end(served?.body)
  } catch (error) {
    // 壊れたURL（`/%` など）でサーバーを落とさない
    const status = error instanceof URIError ? 400 : 500

    console.error(`${status} ${request.url}: ${error.message}`)
    response.writeHead(status, { 'content-type': 'text/plain; charset=utf-8' })
    response.end(status === 400 ? 'Bad Request' : 'Internal Server Error')
  }
})

/** ビルドは子プロセスで実行する。テンプレートを編集しても常に最新のコードが使われる */
const runBuild = () =>
  new Promise((resolve) => {
    spawn(process.execPath, [path.join(SCRIPTS_DIR, 'build.mjs')], { stdio: 'inherit' }).on('exit', resolve)
  })

if (WATCH) {
  let timer = null

  const rebuild = () => {
    clearTimeout(timer)
    timer = setTimeout(runBuild, 50)
  }

  await runBuild()

  // コンテンツ（src/）とビルドスクリプト（このファイルのあるディレクトリ）の両方を監視する
  for (const dir of [path.join(root, 'src'), SCRIPTS_DIR]) {
    watch(dir, { recursive: true }, rebuild)
  }

  console.log(`watching src/ and ${path.basename(SCRIPTS_DIR)}/ for changes (ブラウザは手動でリロードしてください)`)
}

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`ポート${PORT}は使用中です。PORT=2345 pnpm dev のように別のポートを指定してください。`)
    process.exit(1)
  }

  throw error
})

server.listen(PORT, 'localhost', () => console.log(`http://localhost:${PORT}/`))
