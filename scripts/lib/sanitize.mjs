// 构建期 HTML 消毒。
//
// markdown-it 开启了 html: true，文档里可以写原生 HTML（有用例需要），所以
// 渲染结果在进入产物前必须过一遍白名单消毒。这里用 jsdom 提供 DOM、DOMPurify
// 做净化，规则与旧版浏览器端完全一致（见 ALLOWED_ATTRS / purifyConfig）。
//
// 关键点：消毒发生在**构建期**，产物里的 HTML 已经是净化的，客户端不再需要
// 打包 DOMPurify，也就不存在「预渲染内容未经消毒」与「客户端消毒后内容变了」
// 两份输出不一致的问题。

import { JSDOM } from 'jsdom'
import createDOMPurify from 'dompurify'

// mdui-* Web Components 允许使用的属性白名单，避免任意属性（含事件属性）被注入
const ALLOWED_ATTRS = new Set([
  'class', 'style', 'id', 'href', 'target', 'rel', 'variant', 'icon', 'name',
  'slot', 'value', 'content', 'open', 'close-on-esc', 'close-on-overlay-click',
  'order', 'scroll-behavior', 'rounded', 'active', 'alignment', 'accordion',
  'aria-label', 'title', 'role', 'disabled', 'checked', 'readonly', 'required',
  'multiple', 'placeholder', 'type', 'src', 'alt', 'min', 'max', 'step', 'accept',
  'inputmode', 'pattern', 'label', 'headline', 'description', 'end-icon', 'selects',
  'part', 'nowrap', 'clickable', 'nonclickable', 'full-height', 'close-on-element-click',
  'trigger', 'placement', 'autofocus', 'maxlength', 'cols', 'rows', 'spellcheck',
  'enctype', 'method', 'action', 'min-length', 'max-length', 'label-maxlength',
  'prefix', 'suffix', 'icon-only', 'selectable', 'hidden', 'loading'
])

// 校验属性名：白名单内或 data-* 放行；显式拒绝 on* 事件属性防 XSS
function isAllowedAttr(attrName) {
  if (!attrName) return false
  const lower = attrName.toLowerCase()
  if (lower.startsWith('on')) return false
  return ALLOWED_ATTRS.has(lower) || lower.startsWith('data-')
}

const purifyConfig = {
  // 放行 mdui-* Web Components，其余标签走 DOMPurify 默认白名单
  CUSTOM_ELEMENT_HANDLING: {
    tagNameCheck: (tagName) => tagName.startsWith('mdui-'),
    attributeNameCheck: isAllowedAttr,
    allowCustomizedBuiltInElements: false
  }
}

let purifier = null

function getPurifier() {
  if (purifier) return purifier

  const window = new JSDOM('').window
  const instance = createDOMPurify(window)
  if (!instance.isSupported) {
    throw new Error('[sanitize] DOMPurify 初始化失败：jsdom 环境不可用')
  }
  purifier = instance
  return purifier
}

export function sanitizeHtml(html = '') {
  return getPurifier().sanitize(html, purifyConfig)
}
