import DOMPurify from 'dompurify'

// markdown-it 开启了 html: true，v-html 渲染前统一过一遍 DOMPurify，
// 防止文档内容（尤其是外部贡献的 PR）注入脚本。
const purifyConfig = {
  // 放行 mdui-* Web Components，其余标签走 DOMPurify 默认白名单
  CUSTOM_ELEMENT_HANDLING: {
    tagNameCheck: (tagName) => tagName.startsWith('mdui-'),
    attributeNameCheck: () => true,
    allowCustomizedBuiltInElements: false
  }
}

export function sanitizeHtml(html = '') {
  // Node 环境（prerender）没有 DOM，构建期内容可信，原样返回
  if (!DOMPurify.isSupported) return html
  return DOMPurify.sanitize(html, purifyConfig)
}
