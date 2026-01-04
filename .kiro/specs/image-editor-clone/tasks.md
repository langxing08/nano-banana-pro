# 实现计划：Nano Banana 图片编辑器克隆

## 概述

本实现计划将设计文档转化为可执行的编码任务，按照增量开发的方式组织，确保每个任务都能构建在前一个任务的基础上。

## 任务列表

- [x] 1. 基础设施和工具函数
  - [x] 1.1 创建图片处理工具函数 `lib/image-utils.ts`
    - 实现文件类型验证函数 `validateFileType`
    - 实现文件大小验证函数 `validateFileSize`
    - 实现图片预览生成函数 `generatePreview`
    - _Requirements: 1.1, 1.3, 1.4_
  - [ ]* 1.2 编写文件验证属性测试
    - **Property 1: 文件类型和大小验证**
    - **Validates: Requirements 1.1, 1.3, 1.4, 1.5**
  - [x] 1.3 创建剪贴板 hook `hooks/use-clipboard.ts`
    - 实现 `copyToClipboard` 函数
    - 返回复制状态和错误信息
    - _Requirements: 10.1_
  - [ ]* 1.4 编写剪贴板复制属性测试
    - **Property 9: 剪贴板复制功能**
    - **Validates: Requirements 10.1**

- [x] 2. 检查点 - 确保所有测试通过
  - 确保所有测试通过，如有问题请询问用户

- [x] 3. 图片上传组件
  - [x] 3.1 创建 ImageUpload 组件 `components/image-upload.tsx`
    - 实现拖放上传功能
    - 实现点击上传功能
    - 显示预览缩略图
    - 支持多图片上传（最多 9 张）
    - 显示删除按钮
    - _Requirements: 1.1, 1.2, 1.5, 1.6, 1.7_
  - [ ]* 3.2 编写图片预览属性测试
    - **Property 2: 图片预览显示**
    - **Validates: Requirements 1.2**
  - [ ]* 3.3 编写批量上传计数属性测试
    - **Property 3: 批量上传计数一致性**
    - **Validates: Requirements 1.6**
  - [ ]* 3.4 编写图片删除属性测试
    - **Property 4: 图片删除操作**
    - **Validates: Requirements 1.7**

- [x] 4. 输出画廊组件
  - [x] 4.1 创建 OutputGallery 组件 `components/output-gallery.tsx`
    - 显示加载状态
    - 显示生成的图片
    - 提供下载按钮
    - _Requirements: 2.1, 2.2, 2.3, 2.5_

- [x] 5. 更新编辑器区域
  - [x] 5.1 更新 `components/editor-section.tsx`
    - 集成 ImageUpload 组件
    - 集成 OutputGallery 组件
    - 实现复制提示词功能（使用 toast 通知）
    - 实现生成按钮状态管理
    - _Requirements: 1.1-1.7, 2.1-2.5, 10.1-10.3_

- [x] 6. 检查点 - 确保编辑器功能正常
  - 确保所有测试通过，如有问题请询问用户

- [x] 7. 公告横幅和头部更新
  - [x] 7.1 创建 AnnouncementBanner 组件 `components/announcement-banner.tsx`
    - 显示公告消息和链接
    - 实现关闭功能（使用 sessionStorage 保持状态）
    - _Requirements: 12.1, 12.2, 12.3_
  - [ ]* 7.2 编写公告横幅关闭属性测试
    - **Property 11: 公告横幅关闭状态**
    - **Validates: Requirements 12.3**
  - [x] 7.3 创建 MobileNav 组件 `components/mobile-nav.tsx`
    - 实现移动端导航抽屉
    - 包含所有桌面导航链接
    - 点击链接后自动关闭
    - _Requirements: 6.2, 6.3, 6.4_
  - [x] 7.4 更新 Header 组件 `components/header.tsx`
    - 集成 AnnouncementBanner
    - 集成 MobileNav
    - 添加响应式汉堡菜单按钮
    - 实现深色模式切换功能
    - 实现平滑滚动导航
    - _Requirements: 6.1, 7.1, 11.1, 11.3_
  - [ ]* 7.5 编写响应式导航属性测试
    - **Property 6: 响应式导航一致性**
    - **Validates: Requirements 6.1, 6.4**
  - [ ]* 7.6 编写主题切换属性测试
    - **Property 7: 主题切换持久化**
    - **Validates: Requirements 7.1, 7.4**
  - [ ]* 7.7 编写平滑滚动属性测试
    - **Property 10: 平滑滚动导航**
    - **Validates: Requirements 11.1, 11.3**

- [x] 8. 检查点 - 确保头部功能正常
  - 确保所有测试通过，如有问题请询问用户

- [x] 9. 案例展示改进
  - [x] 9.1 更新 ShowcaseSection 组件 `components/showcase-section.tsx`
    - 使用有效的占位图片
    - 添加悬停动画效果
    - 添加前后对比示例
    - _Requirements: 9.1, 9.2, 9.3_
  - [ ]* 9.2 编写案例图片有效性属性测试
    - **Property 8: 案例图片有效性**
    - **Validates: Requirements 9.1**

- [x] 10. 定价页面
  - [x] 10.1 创建定价卡片组件 `components/pricing-card.tsx`
    - 显示层级名称、价格、功能列表
    - 支持月付/年付切换
    - 显示节省百分比
    - 显示 "Most Popular" 标签
    - _Requirements: 3.1, 3.2, 3.4_
  - [ ]* 10.2 编写年付价格计算属性测试
    - **Property 5: 年付价格计算**
    - **Validates: Requirements 3.2**
  - [x] 10.3 创建定价 FAQ 组件 `components/pricing-faq.tsx`
    - 使用 Accordion 组件
    - 显示定价相关问题和答案
    - _Requirements: 3.6_
  - [x] 10.4 创建定价页面 `app/pricing/page.tsx`
    - 集成 PricingCard 组件（3 个层级）
    - 集成 PricingFAQ 组件
    - 添加年付折扣横幅
    - _Requirements: 3.1-3.7_

- [x] 11. API 文档页面
  - [x] 11.1 创建 API 代码示例组件 `components/api-code-block.tsx`
    - 支持多语言切换（JavaScript、Python、cURL）
    - 代码高亮显示
    - 复制代码功能
    - _Requirements: 4.2_
  - [x] 11.2 创建 API 文档页面 `app/api-docs/page.tsx`
    - 显示 API 端点文档
    - 集成代码示例组件
    - 显示认证要求和速率限制
    - 添加"获取 API Key"按钮
    - _Requirements: 4.1-4.4_

- [x] 12. 生成器页面
  - [x] 12.1 创建生成器页面 `app/generator/page.tsx`
    - 复用 ImageUpload 和 OutputGallery 组件
    - 添加 AI 模型选择（Nano Banana、SeeDream 4）
    - 添加分辨率设置（标准、2K、4K）
    - 添加"完成时通知我"选项
    - 显示生成提示和技巧
    - _Requirements: 5.1-5.6_

- [x] 13. 法律页面
  - [x] 13.1 创建隐私政策页面 `app/privacy/page.tsx`
    - 显示隐私政策内容
    - 包含最后修改日期
    - 包含联系信息
    - _Requirements: 8.1, 8.3, 8.4_
  - [x] 13.2 创建服务条款页面 `app/terms/page.tsx`
    - 显示服务条款内容
    - 包含最后修改日期
    - 包含联系信息
    - _Requirements: 8.2, 8.3, 8.4_

- [x] 14. 深色模式全局支持
  - [x] 14.1 更新根布局 `app/layout.tsx`
    - 配置 ThemeProvider
    - 设置默认主题为系统偏好
    - _Requirements: 7.2, 7.3_
  - [x] 14.2 更新全局样式 `app/globals.css`
    - 添加深色模式变量
    - 确保所有组件支持深色模式
    - _Requirements: 7.2_

- [x] 15. 最终检查点 - 确保所有功能正常
  - 确保所有测试通过，如有问题请询问用户

## 备注

- 标记 `*` 的任务为可选任务，可以跳过以加快 MVP 开发
- 每个任务都引用了具体的需求以便追溯
- 检查点确保增量验证
- 属性测试验证通用正确性属性
- 单元测试验证具体示例和边界情况
