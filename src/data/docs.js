export const docsSections = [
  {
    value: 'getting-started',
    titleKey: 'sidebar.gettingStarted',
    icon: 'near_me',
    items: [
      { id: 'introduction', titleKey: 'docs.introduction', path: '' },
      { id: 'installation', titleKey: 'docs.installation', path: 'getting-started/installation' },
      { id: 'usage', titleKey: 'docs.usage', path: 'getting-started/usage' }
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
  return docsPages.find((page) => pathname.endsWith(`/docs/2/${page.path}`) || (page.path === '' && pathname.match(/\/docs\/2\/?$/)))
}
