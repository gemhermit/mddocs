// 提取站点实际用到的 Material Icons 图标名。
//
// mdui-icon 的渲染规则（node_modules/mdui/components/icon/index.js）：
//   name 按 '--' 拆成 [基名, 变体]，变体决定 font-family（Material Icons /
//   Material Icons Round / ...），**实际参与字形合成的文本是去掉后缀的基名**。
//   例如 name="menu_book--rounded" → family 'Material Icons Round'，文本 'menu_book'。
//
// 提取范围（只认这三类字面量，避免把 :name="section.icon" 这类绑定值当成图标名）：
//   1. 模板里的静态属性      name="menu_book--rounded"
//   2. 运行时 setAttribute   setAttribute('name', 'check--rounded')
//   3. 数据里的 icon 字段    icon: 'auto_awesome'
// 第 3 类同时覆盖了 Sidebar/Home/ThemeSelect 里 :name="section.icon" 这类绑定的真实取值。

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ICON_NAME_PATTERN = /^[a-z0-9_]+(?:--[a-z]+)?$/

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      walk(full, out)
    } else if (/\.(vue|js|mjs)$/.test(entry)) {
      out.push(full)
    }
  }
  return out
}

const PATTERNS = [
  /(?<![:\w-])name="([a-z0-9_-]+)"/g,                       // 模板静态属性
  /setAttribute\(\s*'name'\s*,\s*'([a-z0-9_-]+)'\s*\)/g,   // 运行时设置
  /\bicon:\s*'([a-z0-9_-]+)'/g                              // 数据里的 icon 字段
]

/**
 * 返回 { plain: [...], rounded: [...] }，元素是去掉变体后缀的基名。
 */
export function collectIconNames(srcDir) {
  const found = new Set()

  for (const file of walk(srcDir)) {
    const source = readFileSync(file, 'utf-8')
    for (const pattern of PATTERNS) {
      pattern.lastIndex = 0
      let match
      while ((match = pattern.exec(source)) !== null) {
        const value = match[1]
        if (!ICON_NAME_PATTERN.test(value)) continue
        found.add(value)
      }
    }
  }

  const plain = []
  const rounded = []
  for (const value of found) {
    if (value.endsWith('--rounded')) {
      rounded.push(value.slice(0, -'--rounded'.length))
    } else if (!value.includes('--')) {
      plain.push(value)
    }
  }

  return {
    plain: [...new Set(plain)].sort(),
    rounded: [...new Set(rounded)].sort()
  }
}

/** 变体后缀 → @font-face 里声明的 family 名 */
export const FAMILY_BY_VARIANT = {
  plain: 'Material Icons',
  rounded: 'Material Icons Round'
}
