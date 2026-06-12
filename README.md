# MDUI Docs

Material Design 3 (Material You) UI 组件库文档站点，基于 Vue 3 + Vite 构建。

本项目是对 [mdui.org](https://www.mdui.org/) 的 1:1 复刻，使用 mdui 自身的 Web Components 构建文档界面。

## 功能特性

- 响应式设计，支持桌面端和移动端
- 暗色模式支持（跟随系统 / 手动切换）
- 主题色切换（预设颜色 + 自定义颜色）
- 侧边栏导航，支持折叠展开
- 文档页面前后导航
- 代码高亮显示

## 技术栈

- [Vue 3](https://vuejs.org/) - 前端框架
- [Vite](https://vitejs.dev/) - 构建工具
- [Vue Router](https://router.vuejs.org/) - 路由管理
- [mdui](https://www.mdui.org/) - Material Design 3 Web Components 库

## 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

启动后访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist/` 目录。

### 预览构建结果

```bash
npm run preview
```

## 项目结构

```
mddocs/
├── public/
│   └── favicon.svg          # 网站图标
├── src/
│   ├── components/           # 公共组件
│   │   ├── AppBar.vue        # 顶部导航栏
│   │   ├── Footer.vue        # 页脚
│   │   ├── Sidebar.vue       # 文档侧边栏
│   │   └── ThemeSelect.vue   # 主题色选择器
│   ├── router/
│   │   └── index.js          # 路由配置
│   ├── styles/
│   │   └── main.css          # 全局样式
│   ├── views/
│   │   ├── Home.vue          # 首页
│   │   └── docs/
│   │       ├── DocsLayout.vue    # 文档布局
│   │       ├── Introduction.vue  # 介绍页
│   │       ├── Installation.vue  # 安装页
│   │       └── Usage.vue         # 使用指南
│   ├── App.vue               # 根组件
│   └── main.js               # 入口文件
├── index.html                # HTML 入口
├── package.json
├── vite.config.js            # Vite 配置
└── README.md
```

## 添加新文档页面

1. 在 `src/views/docs/` 下创建新的 `.vue` 文件
2. 在 `src/router/index.js` 中添加路由
3. 在 `src/components/Sidebar.vue` 中添加侧边栏链接

示例：

```js
// router/index.js
{
  path: 'new-page',
  name: 'docs-new-page',
  component: () => import('../views/docs/NewPage.vue'),
  meta: { title: 'New Page' }
}
```

## 自定义主题

mdui 支持 Material Design 3 动态主题色。在浏览器控制台中可以测试：

```js
// 设置主题色
mdui.setColorScheme('#6750A4')

// 从图片提取颜色
const color = await mdui.getColorFromImage('image.jpg')
mdui.setColorScheme(color)
```

## 国际化

本项目支持中英文切换。默认语言为英文，可通过顶部导航栏的语言切换按钮切换。

## 许可证

MIT License
