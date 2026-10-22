# MDDocs

一个基于 mdui 2、Vue 3、Vite 和 Markdown 构建的开源文档系统。

MDDocs 提供简洁的 mdui 风格文档界面，采用 Markdown 优先的内容管线，支持多语言文档、粘性导航、页面目录和代码复制交互。

## 功能特性

- 响应式文档布局，适配桌面端和移动端
- 粘性顶栏、侧边栏和页面目录
- 基于 Markdown 的文档内容
- 标题锚点与目录高亮联动
- 章节锚点会写进 URL，链接可直接分享
- 上一页 / 下一页导航
- 代码高亮 + 悬停复制按钮
- 亮色、暗色和跟随系统主题切换
- 中英文文档内容
- 静态预渲染、sitemap、robots.txt 与 `llms.txt`，兼顾 SEO 与 LLM 工具
- 键盘友好的「跳到正文」链接

## 技术栈

运行时（会进入浏览器包）：

- [Vue 3](https://vuejs.org/)
- [Vite](https://vite.dev/)
- [Vue Router](https://router.vuejs.org/)
- [mdui](https://www.mdui.org/)

仅构建期使用（不会进入浏览器包）：

- [markdown-it](https://github.com/markdown-it/markdown-it) —— 解析 Markdown
- [highlight.js](https://highlightjs.org/) —— 代码高亮
- [DOMPurify](https://github.com/cure53/DOMPurify) + [jsdom](https://github.com/jsdom/jsdom) —— 消毒渲染结果

## 快速开始

### 环境要求

- Node.js >= 22.23.4
- pnpm >= 8

`22.23.4` 是包含全部已公开运行时安全修复的第一个版本，更早的 20.x / 22.x 仍受影响。仓库在 `.npmrc` 里开启了 `engine-strict`，在有漏洞的运行时上安装会直接报错而不是只提示一条 warning；另附 `.nvmrc` 供 `nvm use` 使用。

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm run dev
```

开发服务器运行在 `http://localhost:3000`。

### 脚本

| 脚本 | 作用 |
| --- | --- |
| `pnpm run dev` | 启动 Vite 开发服务器 |
| `pnpm run build` | 生成 sitemap / robots / llms，渲染 Markdown 内容，构建站点并预渲染全部路由 |
| `pnpm run build:gh` | 同 `build`，但使用 GitHub Pages 的 `/mddocs/` 基础路径 |
| `pnpm run build:fast` | 只构建不预渲染，迭代更快 |
| `pnpm run build:content` | 只把 Markdown 重新渲染到 `src/content/generated/` |
| `pnpm run preview` | 本地预览生产产物 |
| `pnpm run lint` | 对整个项目跑 ESLint |
| `pnpm run check:docs` | 校验中英文内容一致性与预渲染产物完整性 |
| `pnpm run check:icons` | 校验代码里用到的图标都在子集字体内 |
| `pnpm run icons:subset` | 重新生成子集图标字体（需要 `python3` + `fonttools`） |
| `pnpm run check` | `check:docs` + `check:icons` + `lint` + `build`，与 CI 执行顺序一致 |

### 构建

```bash
pnpm run build
```

构建产物输出到 `dist/` 目录。

## 环境变量

| 变量 | 作用 | 默认值 |
| --- | --- | --- |
| `SITE_URL` | `canonical`、`og:url`、hreflang、sitemap、robots.txt 使用的站点地址 | `https://mddocs.bago.top` |
| `BASE_URL` | Vite `base` 与路由 base，部署在子路径下时使用 | `/` |

`SITE_URL` 不带尾部斜杠，且应与最终访问地址一致。浏览器端与构建脚本读同一个变量，在部署平台里配置一次即可。

## 持续集成

- `.github/workflows/ci.yml`：每次 push 和 pull request 执行 lint、双语内容校验、生产构建、预渲染产物校验与生产依赖漏洞审计。
- `.github/workflows/deploy.yml`：发布到 GitHub Pages。先在 **Settings → Pages → Source** 选 GitHub Actions，再手动运行；也可以打开文件里注释掉的 `push` 触发器，改为合并到 `main` 即发布。

## 部署频率

每次推到生产分支都会触发一次 Vercel 部署，而每次部署都要跑一遍完整构建。为了不把构建额度浪费在不影响站点产物的改动上（README、CI 工作流、ESLint 配置），在 Vercel 控制台把 **Settings → Build and Deployment → Ignored Build Step** 填成 `npm run vercel-ignore`（一次性配置）。

之后脚本会跳过「只改了无关文件」的提交，以及提交信息里带 `[skip deploy]` 标记的提交，其余照常构建部署。本地可以用 `node scripts/vercel-ignore.mjs HEAD` 预览某个提交的判定结果，详见部署文档。

## 文档内容

文档页面位于 `src/content/docs` 目录：

```text
src/content/docs/
├── en/
│   ├── introduction.md
│   └── getting-started/
│       ├── installation.md
│       └── usage.md
└── zh-cn/
    ├── introduction.md
    └── getting-started/
        ├── installation.md
        └── usage.md
```

Markdown 在构建期完成渲染，浏览器端不再解析。`scripts/build-content.mjs` 会把每个页面渲染成 HTML、生成标题 id、完成代码高亮与消毒，结果写入 `src/content/generated/`；浏览器只加载自己那一页对应的小块文件。搜索索引同样在构建期生成，每种语言一个文件，因此打开搜索只需要一次请求，而不是把全部文档都拉一遍。

围栏代码块会自动高亮，每个代码块在悬停时右上角会显示复制按钮。

标题支持定义显式锚点：

```md
## 使用 pnpm 安装 {#install}
```

如果未提供显式锚点，将根据标题文本自动生成 id。

## 添加页面

1. 在 `src/content/docs/en` 和 `src/content/docs/zh-cn` 下添加对应的 Markdown 文件。
2. 在 `src/data/docs.js` 中添加页面条目，使其出现在侧边栏和上下页导航中。
3. 在 `src/i18n/messages.js` 中添加对应的标题文案。

路由会根据 `src/data/docs.js` 自动生成，不需要手动修改路由文件。

`pnpm run check:docs` 会在以下情况报错：登记的页面缺少某种语言、存在未登记的 Markdown 文件、预渲染产物没有覆盖全部路由。

## 项目结构

```text
mddocs/
├── .github/workflows/       # CI 与 GitHub Pages 部署
├── public/                  # 原样拷贝的静态资源（favicon、社交卡片、manifest）
├── scripts/                 # 构建期工具：内容、sitemap、预渲染、校验
├── src/
│   ├── components/          # 公共 UI 组件
│   ├── content/docs/        # Markdown 文档内容
│   ├── content/generated/   # 构建产物：预渲染 HTML 与搜索索引（不入库）
│   ├── data/docs.js         # 文档侧边栏与页面排序
│   ├── i18n/                # 多语言 UI 字符串
│   ├── router/              # 路由定义
│   ├── styles/main.css      # 全局样式
│   ├── utils/               # 站点路径、跳转、代码相关工具
│   └── views/               # 应用与文档布局
├── eslint.config.js
├── index.html
├── package.json
└── vite.config.js
```

## 图标字体

Material Icons 字体自托管，并且**按本站实际用到的图标做过子集化**（295 KB → 3.9 KB；Vite 会把它内联进 CSS，不产生额外请求）。

新增图标后需要重新生成子集，否则浏览器找不到对应字形，图标会直接显示成 "menu_book--rounded" 这类文字：

```bash
pip install fonttools brotli   # 一次性准备
pnpm run icons:subset
```

`pnpm run check:icons`（已包含在 `pnpm run check` 和 CI 里）会比对代码里用到的图标与生成的清单，漏了重新生成会直接让流水线失败，而不是悄悄把页面弄坏。

## 生成物

`public/sitemap.xml`、`public/robots.txt`、`public/llms.txt`、`public/llms-full.txt` 属于构建产物：每次构建重新生成，**不纳入版本管理**。其中 `llms-full.txt` 收录了每个页面的完整正文，LLM 工具无需再抓取站点即可读取文档。

## 安全说明

Markdown 渲染在构建期完成（`scripts/lib/`）：生成的 HTML 在写入磁盘前会经过 [DOMPurify](https://github.com/cure53/DOMPurify) 消毒，移除脚本与事件属性，同时放行 `mdui-*` 自定义元素。因此浏览器端不再打包 Markdown 渲染器与消毒库。如果你接受不可信贡献者的文档内容，请保留构建期消毒逻辑。

## 开源协议

MIT License
