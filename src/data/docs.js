export const docsSections = [
  {
    value: 'getting-started',
    titleKey: 'sidebar.gettingStarted',
    icon: 'near_me--rounded',
    items: [
      { id: 'introduction', titleKey: 'docs.introduction', path: '' },
      { id: 'installation', titleKey: 'docs.installation', path: 'getting-started/installation' },
      { id: 'usage', titleKey: 'docs.usage', path: 'getting-started/usage' },
      { id: 'project-structure', titleKey: 'docs.projectStructure', path: 'getting-started/project-structure' },
      { id: 'markdown-content', titleKey: 'docs.markdownContent', path: 'getting-started/markdown-content' },
      { id: 'localization', titleKey: 'docs.localization', path: 'getting-started/localization' },
      { id: 'deployment', titleKey: 'docs.deployment', path: 'getting-started/deployment' },
      { id: 'faq', titleKey: 'docs.faq', path: 'getting-started/faq' }
    ]
  },
  {
    value: 'ai',
    titleKey: 'sidebar.buildWithAI',
    icon: 'auto_awesome',
    items: [
      { id: 'ai-overview', titleKey: 'docs.aiOverview', path: 'ai/overview' },
      { id: 'ai-writing-docs', titleKey: 'docs.aiWritingDocs', path: 'ai/writing-docs' }
    ]
  },
  {
    value: 'styles',
    titleKey: 'sidebar.styles',
    icon: 'layers--rounded',
    items: [
      { id: 'theme-design', titleKey: 'docs.themeDesign', path: 'styles/theme-design' }
    ]
  },
  {
    value: 'frameworks',
    titleKey: 'sidebar.frameworks',
    icon: 'workspaces--rounded',
    items: [
      { id: 'vue-vite', titleKey: 'docs.vueVite', path: 'frameworks/vue-vite' }
    ]
  },
  {
    value: 'components',
    titleKey: 'sidebar.components',
    icon: 'widgets--rounded',
    items: [
      { id: 'component-example', titleKey: 'docs.componentExample', path: 'components/component-example' }
    ]
  },
  {
    value: 'functions',
    titleKey: 'sidebar.functions',
    icon: 'functions--rounded',
    items: [
      { id: 'function-example', titleKey: 'docs.functionExample', path: 'functions/function-example' }
    ]
  },
  {
    value: 'libraries',
    titleKey: 'sidebar.libraries',
    icon: 'local_mall--rounded',
    items: [
      { id: 'package-example', titleKey: 'docs.packageExample', path: 'libraries/package-example' }
    ]
  }
]

export const docsPages = docsSections.flatMap((section) =>
  section.items.map((item) => ({
    ...item,
    section: section.value
  }))
)

export function findDocPageByPath(pathname = '') {
  return docsPages.find((page) =>
    pathname.endsWith(`/docs/2/${page.path}`) ||
    (page.path === '' && pathname.match(/\/docs\/2\/?$/))
  )
}
