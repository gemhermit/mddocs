import DOMPurify from 'dompurify'

// markdown-it 开启了 html: true，v-html 渲染前统一过一遍 DOMPurify，
// 防止文档内容（尤其是外部贡献的 PR）注入脚本。
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

export function sanitizeHtml(html = '') {
  // Node 环境（prerender）没有 DOM，构建期内容可信，原样返回
  if (!DOMPurify.isSupported) return html
  return DOMPurify.sanitize(html, purifyConfig)
}
