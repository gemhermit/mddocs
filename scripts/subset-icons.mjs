// 图标字体子集化：Material Icons 完整字体 302 KB，却只用来渲染 20 多个图标。
// 这里把两个字体裁到「站点实际用到的字形」，通常能压到几 KB。
//
// 用法：
//   pnpm run icons:subset
//
// 依赖：python3 + fonttools（pip install fonttools brotli）
// 新增图标后必须重新跑一次，否则新图标会显示成字面文字；
// scripts/check-icons.mjs 会在 CI 里比对清单，漏跑会直接报错。
//
// 原始完整字体不在仓库里（体积太大），需要从 Google Material Icons 重新下载：
//   https://fonts.google.com/icons
// 或用 fontsource：npm i @fontsource/material-icons-round

import { execFileSync } from 'node:child_process'
import { existsSync, statSync, writeFileSync, copyFileSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { collectIconNames, FAMILY_BY_VARIANT } from './icon-names.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const FONT_DIR = join(ROOT, 'src/assets/fonts')
const SRC_DIR = join(ROOT, 'src')
const MANIFEST = join(FONT_DIR, 'icons.json')

const TARGETS = [
  { variant: 'plain', file: 'MaterialIcons-Regular.woff2' },
  { variant: 'rounded', file: 'MaterialIconsRound-Regular.woff2' }
]

const names = collectIconNames(SRC_DIR)
console.log(`提取到图标：普通变体 ${names.plain.length} 个，round 变体 ${names.rounded.length} 个`)

const manifest = { generatedBy: 'scripts/subset-icons.mjs', families: {} }
let failed = false

for (const target of TARGETS) {
  const family = FAMILY_BY_VARIANT[target.variant]
  const glyphs = names[target.variant]
  const fontPath = join(FONT_DIR, target.file)

  if (!glyphs.length) {
    console.warn(`[skip] ${family}：没有用到任何图标，保留原文件不处理`)
    continue
  }

  if (!existsSync(fontPath)) {
    console.error(`[fail] 找不到源字体 ${target.file}，请先从 Google Material Icons 下载完整字体放到 ${FONT_DIR}`)
    failed = true
    continue
  }

  const before = statSync(fontPath).size
  const pruned = join(FONT_DIR, `.${target.file}.pruned`)
  const tmp = join(FONT_DIR, `.${target.file}.tmp`)

  // 第一步：先裁掉用不到的连字规则（Material Icons 是一条 rlig 特性带 2000+ 条规则）
  try {
    execFileSync('python3', [
      join(ROOT, 'scripts/prune-icon-ligatures.py'),
      fontPath,
      pruned,
      ...glyphs
    ], { stdio: ['ignore', 'pipe', 'pipe'] })
  } catch (err) {
    const detail = [err.stdout, err.stderr].filter(Boolean).map(String).join('\n')
    console.error(`[fail] ${family} 连字裁剪失败：\n${detail}`)
    failed = true
    continue
  }

  // 第二步：对裁剪后的字体做子集化，闭包就只剩这几个图标
  try {
    execFileSync('python3', [
      '-m', 'fontTools.subset',
      pruned,
      `--text=${glyphs.join(' ')}`,
      `--output-file=${tmp}`,
      '--flavor=woff2',
      '--layout-features=*',
      '--name-IDs=*',
      '--no-hinting'
    ], { stdio: ['ignore', 'pipe', 'pipe'] })
  } catch (err) {
    const detail = [err.stdout, err.stderr].filter(Boolean).map(String).join('\n')
    console.error(`[fail] ${family} 子集化失败：\n${detail}`)
    failed = true
    continue
  }

  const after = statSync(tmp).size
  copyFileSync(tmp, fontPath)
  rmSync(pruned, { force: true })
  rmSync(tmp, { force: true })
  console.log(`[ok] ${family}：${glyphs.length} 个字形，${(before / 1024).toFixed(1)} KB → ${(after / 1024).toFixed(1)} KB`)
  manifest.families[family] = {
    file: target.file,
    glyphs,
    sourceBytes: before,
    subsetBytes: after
  }
}

if (failed) {
  process.exit(1)
}

writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`, 'utf-8')
console.log(`清单已写入 ${MANIFEST.replace(`${ROOT}/`, '')}`)
