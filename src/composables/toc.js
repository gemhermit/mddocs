import { ref } from 'vue'

// 文档页与 DocsLayout 之间共享的 TOC 数据：
// MarkdownDoc 渲染 markdown 时直接产出标题列表写入这里，
// DocsLayout 响应式读取，无需 setTimeout / MutationObserver 抓 DOM。
const tocHeadings = ref([])

export function useToc() {
  function setHeadings(headings) {
    tocHeadings.value = Array.isArray(headings) ? headings : []
  }

  return { headings: tocHeadings, setHeadings }
}
