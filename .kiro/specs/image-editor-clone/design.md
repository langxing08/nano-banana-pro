# 设计文档

## 概述

本设计文档描述了 Nano Banana AI 图片编辑器网站克隆的技术实现方案。项目基于 Next.js 14+ App Router 和 Tailwind CSS 构建，采用组件化架构，保持香蕉主题的视觉设计风格。

## 架构

### 技术栈
- **框架**: Next.js 14+ (App Router)
- **样式**: Tailwind CSS 4.x
- **UI 组件**: shadcn/ui (已集成)
- **状态管理**: React useState/useContext
- **主题**: next-themes (已安装)
- **通知**: sonner (已安装)
- **图标**: lucide-react (已安装)

### 目录结构
```
app/
├── page.tsx                 # 首页（已完成）
├── pricing/
│   └── page.tsx            # 定价页面
├── api-docs/
│   └── page.tsx            # API 文档页面
├── generator/
│   └── page.tsx            # 独立生成器页面
├── privacy/
│   └── page.tsx            # 隐私政策页面
├── terms/
│   └── page.tsx            # 服务条款页面
├── layout.tsx              # 根布局
└── globals.css             # 全局样式

components/
├── header.tsx              # 头部导航（需更新）
├── mobile-nav.tsx          # 移动端导航（新增）
├── announcement-banner.tsx # 公告横幅（新增）
├── editor-section.tsx      # 编辑器区域（需更新）
├── showcase-section.tsx    # 案例展示（需更新）
├── pricing-card.tsx        # 定价卡片（新增）
├── pricing-faq.tsx         # 定价 FAQ（新增）
├── api-code-block.tsx      # API 代码示例（新增）
├── image-upload.tsx        # 图片上传组件（新增）
├── output-gallery.tsx      # 输出画廊组件（新增）
└── ui/                     # shadcn/ui 组件（已存在）

lib/
├── utils.ts                # 工具函数（已存在）
└── image-utils.ts          # 图片处理工具（新增）

hooks/
├── use-toast.ts            # Toast hook（已存在）
├── use-mobile.ts           # 移动端检测（已存在）
└── use-clipboard.ts        # 剪贴板 hook（新增）
```

## 组件和接口

### 1. ImageUpload 组件

```typescript
interface ImageUploadProps {
  maxFiles?: number;           // 最大文件数，默认 9
  maxSize?: number;            // 最大文件大小（字节），默认 10MB
  acceptedTypes?: string[];    // 接受的文件类型
  onUpload: (files: UploadedImage[]) => void;
  onError: (error: string) => void;
}

interface UploadedImage {
  id: string;
  file: File;
  preview: string;             // base64 预览 URL
  name: string;
  size: number;
}
```

### 2. OutputGallery 组件

```typescript
interface OutputGalleryProps {
  images: GeneratedImage[];
  isLoading: boolean;
  onDownload: (image: GeneratedImage) => void;
}

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  createdAt: Date;
}
```

### 3. PricingCard 组件

```typescript
interface PricingCardProps {
  tier: 'basic' | 'pro' | 'max';
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  credits: number;
  features: string[];
  isPopular?: boolean;
  quantityOptions?: number[];
}
```

### 4. MobileNav 组件

```typescript
interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  links: NavLink[];
}

interface NavLink {
  label: string;
  href: string;
  isDropdown?: boolean;
  children?: NavLink[];
}
```

### 5. AnnouncementBanner 组件

```typescript
interface AnnouncementBannerProps {
  message: string;
  linkText: string;
  linkHref: string;
  onDismiss?: () => void;
}
```

## 数据模型

### 定价层级数据

```typescript
const pricingTiers = [
  {
    tier: 'basic',
    name: 'Basic',
    monthlyPrice: 12,
    yearlyPrice: 144,
    credits: 2400,
    imagesPerMonth: 100,
    features: [
      'All style templates included',
      'Standard generation speed',
      'Basic customer support',
      'JPG/PNG format downloads',
      'Commercial Use License'
    ]
  },
  {
    tier: 'pro',
    name: 'Pro',
    monthlyPrice: 19.5,
    yearlyPrice: 234,
    credits: 9600,
    imagesPerMonth: 400,
    isPopular: true,
    features: [
      'Support Seedream-4 Model',
      'Support Nanobanana-Pro Model',
      'All style templates included',
      'Priority generation queue',
      'Priority customer support',
      'JPG/PNG/WebP format downloads',
      'Batch generation feature',
      'Image editing tools (Coming in October)',
      'Commercial Use License'
    ]
  },
  {
    tier: 'max',
    name: 'Max',
    monthlyPrice: 80,
    yearlyPrice: 960,
    credits: 43200,
    imagesPerMonth: 1800,
    features: [
      'Support Seedream-4 Model',
      'Support Nanobanana-Pro Model',
      'All style templates included',
      'Fastest generation speed',
      'Dedicated account manager',
      'All format downloads',
      'Batch generation feature',
      'Professional editing suite (Coming in October)',
      'Commercial Use License'
    ]
  }
];
```

### FAQ 数据

```typescript
interface FAQItem {
  question: string;
  answer: string;
}

const pricingFAQs: FAQItem[] = [
  {
    question: 'What are credits and how do they work?',
    answer: '2 credits generate 1 high-quality image...'
  },
  // ... 更多 FAQ
];
```



## 正确性属性

*正确性属性是指在系统所有有效执行中都应保持为真的特征或行为——本质上是关于系统应该做什么的形式化陈述。属性作为人类可读规范和机器可验证正确性保证之间的桥梁。*


### Property 1: 文件类型和大小验证

*对于任意* 上传的文件，验证函数应该：
- 当文件类型为 JPEG、PNG、WebP 或 GIF 且大小 ≤ 10MB 时返回有效
- 当文件类型不在支持列表中或大小 > 10MB 时返回无效并附带错误信息

**Validates: Requirements 1.1, 1.3, 1.4, 1.5**

### Property 2: 图片预览显示

*对于任意* 有效的图片文件上传，上传完成后应该生成一个有效的 base64 预览 URL，且该 URL 可以被 img 标签正确渲染。

**Validates: Requirements 1.2**

### Property 3: 批量上传计数一致性

*对于任意* N 张图片的上传操作（1 ≤ N ≤ 9），上传后的图片列表长度应该等于 N，且计数指示器显示的数字应该等于 N。

**Validates: Requirements 1.6**

### Property 4: 图片删除操作

*对于任意* 包含 N 张图片的列表，删除其中一张图片后，列表长度应该等于 N-1，且被删除的图片不再出现在列表中。

**Validates: Requirements 1.7**

### Property 5: 年付价格计算

*对于任意* 定价层级，年付价格应该等于月付价格 × 12 × 折扣系数，且显示的节省百分比应该正确反映折扣。

**Validates: Requirements 3.2**

### Property 6: 响应式导航一致性

*对于任意* 视口宽度：
- 当宽度 < 768px 时，汉堡菜单图标应该可见
- 当宽度 ≥ 768px 时，桌面导航应该可见
- 移动导航和桌面导航应该包含相同的链接集合

**Validates: Requirements 6.1, 6.4**

### Property 7: 主题切换持久化

*对于任意* 主题切换操作，切换后：
- 当前主题状态应该改变（light ↔ dark）
- localStorage 中的主题值应该与当前主题状态一致
- 页面刷新后应该保持切换后的主题

**Validates: Requirements 7.1, 7.4**

### Property 8: 案例图片有效性

*对于任意* ShowcaseSection 中的图片，图片 URL 应该是有效的（返回 200 状态码或是有效的本地路径）。

**Validates: Requirements 9.1**

### Property 9: 剪贴板复制功能

*对于任意* 提示词文本，点击复制按钮后，剪贴板内容应该与原始提示词文本完全一致。

**Validates: Requirements 10.1**

### Property 10: 平滑滚动导航

*对于任意* 锚点链接点击，滚动完成后：
- 目标区域应该在视口中可见
- URL hash 应该更新为目标区域的 ID

**Validates: Requirements 11.1, 11.3**

### Property 11: 公告横幅关闭状态

*对于任意* 公告横幅关闭操作，关闭后横幅应该不再显示，且关闭状态应该在会话期间保持。

**Validates: Requirements 12.3**

## 错误处理

### 图片上传错误
- 文件类型不支持：显示 "Unsupported file type. Please upload JPEG, PNG, WebP, or GIF."
- 文件过大：显示 "File size exceeds 10MB limit."
- 上传失败：显示 "Upload failed. Please try again."

### 生成错误
- 无图片：显示 "Please upload at least one image."
- 无提示词：显示 "Please enter a prompt."
- 生成失败：显示 "Generation failed. Please try again."

### 剪贴板错误
- 复制失败：显示 "Failed to copy. Please try again."

## 测试策略

### 单元测试
- 使用 Jest + React Testing Library
- 测试文件验证函数
- 测试价格计算函数
- 测试组件渲染

### 属性测试
- 使用 fast-check 库进行属性测试
- 每个属性测试运行至少 100 次迭代
- 测试标签格式：**Feature: image-editor-clone, Property {number}: {property_text}**

### 集成测试
- 使用 Playwright 进行端到端测试
- 测试页面导航
- 测试响应式布局
- 测试主题切换

### 测试覆盖目标
- 单元测试覆盖率 > 80%
- 所有属性测试通过
- 关键用户流程 100% 覆盖
