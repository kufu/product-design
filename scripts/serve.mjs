import { spawn } from 'node:child_process'
import { watch } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

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
    if (!file.startsWith(OUT_DIR)) return undefined

    try {
      return { body: await readFile(file), ext: path.extname(file) }
    } catch {
      continue
    }
  }

  return undefined
}

const server = createServer(async (request, response) => {
  const { pathname } = new URL(request.url, `http://localhost:${PORT}`)
  const asset = await readAsset(decodeURIComponent(pathname))
  const fallback = asset ?? { ...(await readAsset('/404.html')), status: 404 }

  response.writeHead(fallback.status ?? 200, {
    'content-type': CONTENT_TYPES[fallback.ext] ?? 'application/octet-stream',
    'cache-control': 'no-store',
  })
  response.end(fallback.body)
})

/** ビルドは子プロセスで実行する。テンプレートを編集しても常に最新のコードが使われる */
const runBuild = () =>
  new Promise((resolve) => {
    const script = fileURLToPath(new URL('./build.mjs', import.meta.url))

    spawn(process.execPath, [script], { stdio: 'inherit' }).on('exit', resolve)
  })

if (WATCH) {
  let timer = null

  const rebuild = () => {
    clearTimeout(timer)
    timer = setTimeout(runBuild, 50)
  }

  await runBuild()

  watch(path.join(root, 'src'), { recursive: true }, rebuild)

  console.log('watching src/ for changes (ブラウザは手動でリロードしてください)')
}

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`ポート${PORT}は使用中です。PORT=2345 pnpm dev のように別のポートを指定してください。`)
    process.exit(1)
  }

  throw error
})

server.listen(PORT, 'localhost', () => console.log(`http://localhost:${PORT}/`))
