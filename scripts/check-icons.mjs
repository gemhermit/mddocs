// 校验图标字体子集没有漏：站点用到的每个图标，都必须存在于子集字体的清单里。
//
// 为什么需要它：字体被子集化后，新增图标如果没重新执行 pnpm run icons:subset，
// 浏览器会找不到对应字形，把 "menu_book--rounded" 这种字面文本直接显示出来 ——
// 属于「构建成功但页面坏掉」的静默故障，CI 必须拦。

import { existsSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { collectIconNames, FAMILY_BY_VARIANT } from './icon-names.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const FONT_DIR = join(ROOT, 'src/assets/fonts')
const MANIFEST = join(FONT_DIR, 'icons.json')

if (!existsSync(MANIFEST)) {
  console.error(`[error] 缺少图标清单 ${MANIFEST.replace(`${ROOT}/`, '')}，请先执行 pnpm run icons:subset`)
  process.exit(1)
}

const manifest = JSON.parse(readFileSync(MANIFEST, 'utf-8'))
const names = collectIconNames(join(ROOT, 'src'))

const errors = []

for (const variant of ['plain', 'rounded']) {
  const family = FAMILY_BY_VARIANT[variant]
  const entry = manifest.families?.[family]
  const glyphs = names[variant]

  if (!entry) {
    if (glyphs.length) {
      errors.push(`清单里没有 ${family} 这一族，但代码里用了 ${glyphs.length} 个该族图标`)
    }
    continue
  }

  const available = new Set(entry.glyphs)
  const missing = glyphs.filter((glyph) => !available.has(glyph))
  if (missing.length) {
    errors.push(`${family} 子集缺少字形：${missing.join(', ')}（执行 pnpm run icons:subset 重新生成）`)
  }

  const fontPath = join(FONT_DIR, entry.file)
  if (!existsSync(fontPath)) {
    errors.push(`清单指向的字体文件不存在：${entry.file}`)
  }
}

for (const error of errors) {
  console.error(`[error] ${error}`)
}

if (errors.length) {
  console.error(`\n图标校验失败：${errors.length} 个问题`)
  process.exit(1)
}

const total = names.plain.length + names.rounded.length
console.log(`图标校验通过：${total} 个图标均在子集字体清单内`)
