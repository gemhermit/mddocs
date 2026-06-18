export const docsSections = [
  {
    value: 'getting-started',
    titleKey: 'sidebar.gettingStarted',
    icon: 'near_me--rounded',
    items: [
      { id: 'introduction', titleKey: 'docs.introduction', path: '' },
      { id: 'installation', titleKey: 'docs.installation', path: 'getting-started/installation' },
      { id: 'usage', titleKey: 'docs.usage', path: 'getting-started/usage' },
      { id: 'typescript-support', titleKey: 'docs.typescriptSupport', path: 'getting-started/typescript-support' },
      { id: 'ide-support', titleKey: 'docs.ideSupport', path: 'getting-started/ide-support' },
      { id: 'localization', titleKey: 'docs.localization', path: 'getting-started/localization' },
      { id: 'faq', titleKey: 'docs.faq', path: 'getting-started/faq' }
    ]
  },
  {
    value: 'ai',
    titleKey: 'sidebar.buildWithAI',
    icon: 'auto_awesome',
    items: []
  },
  {
    value: 'styles',
    titleKey: 'sidebar.styles',
    icon: 'layers--rounded',
    items: []
  },
  {
    value: 'frameworks',
    titleKey: 'sidebar.frameworks',
    icon: 'workspaces--rounded',
    items: []
  },
  {
    value: 'components',
    titleKey: 'sidebar.components',
    icon: 'widgets--rounded',
    items: []
  },
  {
    value: 'functions',
    titleKey: 'sidebar.functions',
    icon: 'functions--rounded',
    items: []
  },
  {
    value: 'libraries',
    titleKey: 'sidebar.libraries',
    icon: 'local_mall--rounded',
    items: []
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
