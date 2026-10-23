import { spawn } from 'node:child_process'
import { watch } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))

const SRC_DIR = path.join(root, 'src')
const SCRIPTS_DIR = path.join(root, 'scripts')
const BUILD_SCRIPT = path.join(SCRIPTS_DIR, 'build.mjs')

/** 保存が連続したときに、1回のビルドへまとめるための待ち時間（ミリ秒） */
const DEBOUNCE = 50

/** ビルドは子プロセスで実行する。ビルドスクリプトを編集しても常に最新のコードが使われる */
const runBuild = () =>
  new Promise((resolve) => {
    spawn(process.execPath, [BUILD_SCRIPT], { stdio: 'inherit' }).on('exit', resolve)
  })

/**
 * まず1回ビルドし、そのあとはコンテンツ（src/）とビルドスクリプト（scripts/）の変更を待って再ビルドする。
 * ブラウザの自動リロードはしない。
 */
export const buildAndWatch = async () => {
  await runBuild()

  let timer = null
  // ビルドはdist/を作り直すので、前のビルドが終わってから次を始める（ここに順番待ちさせる）
  let builds = Promise.resolve()

  const scheduleRebuild = () => {
    // 保存が連続したときは、最後の変更からDEBOUNCEだけ待って1回のビルドにまとめる
    clearTimeout(timer)
    timer = setTimeout(() => {
      builds = builds.then(runBuild)
    }, DEBOUNCE)
  }

  for (const dir of [SRC_DIR, SCRIPTS_DIR]) {
    watch(dir, { recursive: true }, scheduleRebuild)
  }

  console.log('watching src/ and scripts/ for changes (ブラウザは手動でリロードしてください)')
}
