// Vercel「Ignored Build Step」判定脚本。
//
// 用法：在 Vercel 项目的 Settings → Build and Deployment → Ignored Build Step
// 填 `npm run vercel-ignore`（一次性配置）。此后每次 push：
//   退出码 0 → 跳过本次构建与部署（不消耗构建/部署额度）
//   退出码 1 → 正常构建并部署
//
// 判定规则（按顺序）：
//   1. 提交信息里带 `[skip deploy]` → 跳过
//   2. 本次提交只改动了「不影响站点产物」的文件 → 跳过
//      （README、LICENSE、CI 配置、ESLint 配置等）
//   3. 其余情况 → 构建
//
// 为什么需要：静态站点的每次部署都会跑一遍完整构建（渲染 30 个页面 + 打包 +
// 预渲染），一次 push 就是一次构建额度。日常改动（改 README、调 CI、跟同伴
// 互相对齐）没必要每次都发版。
//
// 判定不出来的时候一律选择「构建」——多花一次额度总比线上没更新安全。

import { execFileSync } from 'node:child_process'

const SKIP_MARKER = /\[skip[\s-]?deploy\]/i

// 与站点产物无关的文件：改了也不会改变 dist/ 的内容
const NON_BUILD_PATTERNS = [
  /^README(_zh-CN)?\.md$/i,
  /^LICENSE$/i,
  /^CHANGELOG\.md$/i,
  /^CONTRIBUTING\.md$/i,
  /^\.github\//,
  /^\.gitignore$/,
  /^\.npmrc$/,
  /^\.nvmrc$/,
  /^eslint\.config\.js$/,
  /^\.vscode\//,
  /^\.idea\//
]

export function isBuildAffectingFile(filePath = '') {
  const path = filePath.replace(/^\.\//, '').trim()
  if (!path) return true
  return !NON_BUILD_PATTERNS.some((pattern) => pattern.test(path))
}

export function shouldSkip({ message = '', files = [] } = {}) {
  if (SKIP_MARKER.test(message)) {
    return { skip: true, reason: '提交信息包含 [skip deploy]' }
  }

  if (!files.length) {
    return { skip: false, reason: '没有读到改动文件，按需构建处理' }
  }

  const affecting = files.filter((file) => isBuildAffectingFile(file))
  if (!affecting.length) {
    return { skip: true, reason: `只改动了不影响产物的文件（${files.join(', ')}）` }
  }

  return { skip: false, reason: `改动涉及站点产物（${affecting.slice(0, 3).join(', ')}）` }
}

function git(args, options = {}) {
  return execFileSync('git', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
    ...options
  }).trim()
}

function readCommit(ref) {
  const message = git(['log', '-1', '--pretty=%B', ref])
  let files
  try {
    files = git(['diff-tree', '--no-commit-id', '--name-only', '-r', '--root', ref])
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
  } catch {
    files = []
  }
  return { message, files }
}

function selfTest() {
  const cases = [
    { name: '只改 README → 跳过', input: { message: 'docs: 改说明', files: ['README.md'] }, expect: true },
    { name: '只改 CI → 跳过', input: { message: 'ci: 调参数', files: ['.github/workflows/ci.yml'] }, expect: true },
    { name: '只改 ESLint 配置 → 跳过', input: { message: 'lint: 放宽规则', files: ['eslint.config.js'] }, expect: true },
    { name: '带 [skip deploy] 标记 → 跳过', input: { message: 'chore: 整理 [skip deploy]', files: ['src/main.js'] }, expect: true },
    { name: '改源码 → 构建', input: { message: 'feat: 改组件', files: ['src/main.js'] }, expect: false },
    { name: '改文档正文 → 构建', input: { message: 'docs: 改内容', files: ['src/content/docs/en/introduction.md'] }, expect: false },
    { name: '改构建脚本 → 构建', input: { message: 'build: 调整', files: ['scripts/build-content.mjs'] }, expect: false },
    { name: '改 vercel.json → 构建', input: { message: 'deploy: 调整', files: ['vercel.json'] }, expect: false },
    { name: '改 package.json → 构建', input: { message: 'deps: 升级', files: ['package.json'] }, expect: false }
  ]

  let failed = 0
  for (const testCase of cases) {
    const result = shouldSkip(testCase.input)
    const ok = result.skip === testCase.expect
    if (!ok) failed++
    console.log(`${ok ? '✓' : '✗'} ${testCase.name} → ${result.skip ? '跳过构建' : '构建'}（${result.reason}）`)
  }

  if (failed) {
    console.error(`\n${failed} 个用例未通过`)
    process.exitCode = 1
  } else {
    console.log(`\n全部 ${cases.length} 个用例通过`)
  }
}

const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())

if (isMain) {
  if (process.argv.includes('--self-test')) {
    selfTest()
  } else {
    const ref = process.argv[2] || 'HEAD'
    let commit = { message: '', files: [] }
    try {
      commit = readCommit(ref)
    } catch (error) {
      console.error(`[vercel-ignore] 读取 git 信息失败：${error.message}，按需构建处理`)
    }

    const result = shouldSkip(commit)
    console.log(`[vercel-ignore] ${result.skip ? '跳过本次构建' : '正常构建'}（${result.reason}）`)
    process.exit(result.skip ? 0 : 1)
  }
}
