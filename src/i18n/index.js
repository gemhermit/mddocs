import { computed, ref } from 'vue'
import { getLocaleFromPath } from '../utils/site.js'

const messages = {
  en: {
    nav: {
      docs: 'Docs',
      mdui2Docs: 'mdui 2 Docs',
      mdui1Docs: 'mdui 1 Docs',
      materialDesign1: 'Material Design 1'
    },
    ai: {
      tooltip: 'AI Assistant',
      copyLlmsTxt: 'Copy llms.txt URL',
      copyLlmsFullTxt: 'Copy llms-full.txt URL',
      viewAsMarkdown: 'View as Markdown',
      discussPageChatgpt: 'Discuss this page with ChatGPT',
      discussChatgpt: "Discuss this project's docs with ChatGPT"
    },
    home: {
      subtitle: 'Material Design 3 (Material You) UI components, build with Web Components.',
      getStarted: 'Get Started',
      install: 'Install',
      github: 'Github'
    },
    features: {
      webComponents: { title: 'Web Components', desc: 'mdui components are build with Web Components, offering simplicity similar to using a <div> tag.' },
      materialYou: { title: 'Material You', desc: 'Following Material Design 3 (Material You) guidelines for a user-friendly, visually pleasing product.' },
      dynamicColor: { title: 'Dynamic Color', desc: 'Creates a full color scheme from a color or image, usable across all mdui components.' },
      darkMode: { title: 'Dark Mode', desc: "Supports dark mode and automatic switching based on the system's light/dark preference." },
      lightweight: { title: 'Lightweight', desc: 'With GZIP, the CSS + JavaScript totals 85KB. Choose selective imports for further size reduction.' },
      ideSupport: { title: 'IDE Support', desc: 'Enjoy smooth code hints in VSCode and WebStorm. Use our VSCode extensions and WebStorm plugins for a superior development experience.' },
      frameworkSupport: { title: 'Framework Support', desc: 'mdui smoothly integrates with Vue, React, Angular, and other web apps.' },
      typescriptSupport: { title: 'TypeScript Support', desc: 'Built with TypeScript, mdui provides excellent type hints.' },
      noDependencies: { title: 'No dependencies', desc: 'mdui works independently of third-party libraries for quicker load times and less network traffic.' },
      richComponents: { title: 'Rich Component Library', desc: 'mdui offers 30+ components and a dozen utility functions, covering common use cases.' },
      materialIcons: { title: 'Material Icons', desc: 'Access over 10,000 icon components, available for selective import.' },
      easeOfLearning: { title: 'Ease of Learning', desc: 'Basic knowledge of HTML, CSS, and JavaScript is sufficient to use mdui.' }
    },
    footer: {
      community: 'Community',
      githubIssue: 'Github issue',
      resources: 'Resources',
      sponsor: 'Sponsor',
      paypal: 'PayPal',
      alipay: 'Alipay',
      wechat: 'WeChat'
    },
    toc: 'On this page',
    navPrev: 'Previous',
    navNext: 'Up Next',
    sidebar: {
      gettingStarted: 'Getting Started',
      resources: 'Resources',
      buildWithAI: 'Build with AI',
      styles: 'Styles',
      frameworks: 'Frameworks',
      components: 'Components',
      functions: 'Functions',
      libraries: 'Libraries'
    },
    docs: {
      introduction: 'Introduction',
      installation: 'Installation',
      usage: 'Usage',
      typescriptSupport: 'TypeScript Support',
      ideSupport: 'IDE Support',
      localization: 'Localization',
      faq: 'Frequently Asked Questions'
    }
  },
  'zh-cn': {
    nav: {
      docs: '文档',
      mdui2Docs: 'mdui 2 开发文档',
      mdui1Docs: 'mdui 1 开发文档',
      materialDesign1: 'Material Design 1'
    },
    ai: {
      tooltip: 'AI 辅助开发',
      copyLlmsTxt: '复制 llms.txt 链接',
      copyLlmsFullTxt: '复制 llms-full.txt 链接',
      viewAsMarkdown: '查看 Markdown 源文件',
      discussPageChatgpt: '与 ChatGPT 讨论此页面',
      discussChatgpt: '与 ChatGPT 讨论此项目文档'
    },
    home: {
      subtitle: 'Material Design 3 (Material You) UI 组件库，使用 Web Components 构建。',
      getStarted: '快速开始',
      install: '安装',
      github: 'Github'
    },
    features: {
      webComponents: { title: 'Web Components', desc: 'mdui 组件使用 Web Components 构建，使用方式和 <div> 标签一样简单。' },
      materialYou: { title: 'Material You', desc: '遵循 Material Design 3 (Material You) 规范，打造用户友好、视觉美观的产品。' },
      dynamicColor: { title: '动态配色', desc: '从颜色或图片中提取完整配色方案，应用于所有 mdui 组件。' },
      darkMode: { title: '深色模式', desc: '支持深色模式，并可根据系统的浅色/深色偏好自动切换。' },
      lightweight: { title: '轻量级', desc: 'CSS + JavaScript 经 GZIP 压缩后总计 85KB，支持按需引入以进一步减小体积。' },
      ideSupport: { title: 'IDE 支持', desc: '在 VSCode 和 WebStorm 中享受流畅的代码提示。使用我们的 VSCode 扩展和 WebStorm 插件获得更好的开发体验。' },
      frameworkSupport: { title: '框架支持', desc: 'mdui 可以顺畅地与 Vue、React、Angular 及其他 Web 应用集成。' },
      typescriptSupport: { title: 'TypeScript 支持', desc: '使用 TypeScript 构建，mdui 提供优秀的类型提示。' },
      noDependencies: { title: '无依赖', desc: 'mdui 不依赖任何第三方库，加载更快、网络流量更少。' },
      richComponents: { title: '丰富的组件库', desc: 'mdui 提供 30+ 个组件和十几个实用函数，覆盖常见使用场景。' },
      materialIcons: { title: 'Material 图标', desc: '提供超过 10,000 个图标组件，支持按需引入。' },
      easeOfLearning: { title: '易于学习', desc: '只需具备基本的 HTML、CSS 和 JavaScript 知识即可使用 mdui。' }
    },
    footer: {
      community: '社区',
      githubIssue: 'Github issue',
      resources: '资源',
      sponsor: '赞助',
      paypal: 'PayPal',
      alipay: '支付宝',
      wechat: '微信'
    },
    toc: '本页目录',
    navPrev: '上一章',
    navNext: '下一章',
    sidebar: {
      gettingStarted: '开发指南',
      resources: '资源',
      buildWithAI: 'AI 辅助开发',
      styles: '样式',
      frameworks: '与框架集成',
      components: '组件',
      functions: '函数',
      libraries: '独立包'
    },
    docs: {
      introduction: '概述',
      installation: '安装',
      usage: '快速入门',
      typescriptSupport: 'TypeScript 支持',
      ideSupport: 'IDE 支持',
      localization: '本地化',
      faq: '常见问题'
    }
  }
}

function getStoredLocale() {
  if (typeof window === 'undefined') {
    return 'en'
  }

  return localStorage.getItem('mdui-locale') || 'en'
}

const currentLocale = ref(getStoredLocale())

function applyDocumentLanguage(locale) {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.setAttribute('lang', locale === 'zh-cn' ? 'zh-CN' : 'en')
}

export function useI18n() {
  function t(key) {
    const keys = key.split('.')
    let val = messages[currentLocale.value]
    for (const k of keys) {
      val = val?.[k]
    }
    return val || key
  }

  function setLocale(locale) {
    currentLocale.value = locale
    if (typeof window !== 'undefined') {
      localStorage.setItem('mdui-locale', locale)
    }
    applyDocumentLanguage(locale)
  }

  function syncLocaleWithPath(path) {
    const localeFromPath = getLocaleFromPath(path)

    if (currentLocale.value !== localeFromPath) {
      setLocale(localeFromPath)
      return localeFromPath
    }

    applyDocumentLanguage(localeFromPath)
    return localeFromPath
  }

  function toggleLocale() {
    setLocale(currentLocale.value === 'en' ? 'zh-cn' : 'en')
  }

  const locale = computed(() => currentLocale.value)

  return { t, setLocale, syncLocaleWithPath, toggleLocale, locale }
}

applyDocumentLanguage(currentLocale.value)
