# Nano Banana - AI Image Editor

一个基于 AI 的图像编辑器，使用简单的文字提示即可转换任何图像。

## ✨ 功能特性

- 🎨 **AI 图像编辑** - 通过自然语言描述编辑图像
- 🖼️ **图像上传** - 支持拖拽上传和点击上传
- 🌓 **深色/浅色主题** - 自动适配系统主题
- 📱 **响应式设计** - 完美支持移动端和桌面端
- 💰 **定价页面** - 展示不同订阅方案
- 📄 **API 文档** - 开发者集成指南

## 🛠️ 技术栈

- **框架**: [Next.js 16](https://nextjs.org/) (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS 4
- **UI 组件**: Radix UI + shadcn/ui
- **测试**: Vitest + Testing Library
- **部署**: Vercel

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 运行测试

```bash
pnpm test
```

### 构建生产版本

```bash
pnpm build
```

## 📁 项目结构

```
├── app/                  # Next.js App Router 页面
│   ├── api-docs/        # API 文档页面
│   ├── generator/       # 图像生成器页面
│   ├── pricing/         # 定价页面
│   ├── privacy/         # 隐私政策
│   └── terms/           # 服务条款
├── components/          # React 组件
│   ├── ui/              # 基础 UI 组件
│   └── ...              # 业务组件
├── hooks/               # 自定义 React Hooks
├── lib/                 # 工具函数
└── public/              # 静态资源
```

## 📝 License

MIT
