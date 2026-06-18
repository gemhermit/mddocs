# 安装

这一页介绍如何安装并本地运行 MDDocs 文档系统。

## 环境要求 {#requirements}

在开始之前，请确保本机已经安装：

- Node.js 18 或更高版本。
- npm 9 或更高版本。
- Git。

你可以通过以下命令检查版本：

```bash
node -v
npm -v
git --version
```

## 获取项目 {#clone}

从仓库克隆项目：

```bash
git clone https://github.com/gemhermit/mddocs.git
cd mddocs
```

如果你是基于此项目创建自己的文档站，可以 fork 后再克隆你的仓库。

## 安装依赖 {#install-dependencies}

在项目根目录执行：

```bash
npm install
```

项目依赖包含 Vue、Vite、Vue Router、mdui、markdown-it 和 highlight.js。这些依赖用于渲染页面、解析 Markdown、生成文档布局和高亮代码块。

## 启动开发服务器 {#dev-server}

启动本地开发服务：

```bash
npm run dev
```

默认访问地址为：

```text
http://localhost:3000
```

如果端口被占用，Vite 会提示可用的新端口。

## 构建生产版本 {#build}

构建静态产物：

```bash
npm run build
```

构建结果会输出到 `dist/` 目录，可以部署到任意静态站点服务。

## 本地预览构建结果 {#preview}

构建后可以执行：

```bash
npm run preview
```

这会用本地服务器预览 `dist/` 目录中的生产产物。
