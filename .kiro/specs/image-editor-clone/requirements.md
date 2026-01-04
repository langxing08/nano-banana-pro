# 需求文档

## 简介

本文档概述了完成 Nano Banana AI 图片编辑器网站克隆（基于 imgeditor.co）的需求。当前实现已包含基础 UI 组件（头部、英雄区、编辑器 UI、功能特性、案例展示、用户评价、FAQ、页脚）。本规格说明聚焦于使应用完全功能化所需的剩余功能，包括实际图片上传/处理、定价页面、API 页面、生成器页面和法律页面。

## 术语表

- **Image_Editor**: 处理图片上传、预览和 AI 提示词提交的主要组件
- **Upload_Handler**: 负责处理和验证图片文件上传的服务
- **Gallery**: 显示生成/编辑图片的输出区域
- **Pricing_Page**: 显示订阅计划和定价信息的页面（Basic/Pro/Max 三个层级）
- **API_Page**: 为开发者提供 API 文档的页面
- **Generator_Page**: 独立的完整图片生成器页面（/generator）
- **Privacy_Page**: 隐私政策页面
- **Terms_Page**: 服务条款页面

## 需求

### 需求 1：功能性图片上传

**用户故事：** 作为用户，我希望能够上传图片到编辑器，以便使用 AI 提示词进行编辑。

#### 验收标准

1. WHEN 用户通过上传区域选择图片文件时，THE Upload_Handler SHALL 验证文件类型（JPEG、PNG、WebP、GIF）和大小（最大 10MB）
2. WHEN 上传有效图片时，THE Image_Editor SHALL 在参考图片区域显示预览缩略图
3. WHEN 选择无效文件类型时，THE Upload_Handler SHALL 显示错误消息，说明支持的格式
4. WHEN 文件超过大小限制时，THE Upload_Handler SHALL 显示错误消息，说明最大允许大小
5. WHEN 用户将图片拖放到上传区域时，THE Upload_Handler SHALL 以与文件选择相同的方式处理
6. WHEN 上传多张图片（批量模式）时，THE Image_Editor SHALL 显示所有缩略图并带有计数指示器（最多 9 张图片）
7. WHEN 用户点击已上传图片的删除按钮时，THE Image_Editor SHALL 从选择中移除该图片

### 需求 2：图片生成模拟

**用户故事：** 作为用户，我希望在输出画廊中看到生成的图片，以便预览 AI 编辑结果。

#### 验收标准

1. WHEN 用户使用有效图片和提示词点击"Generate Now"时，THE Image_Editor SHALL 在 Gallery 中显示加载状态
2. WHEN 生成完成时，THE Gallery SHALL 显示结果图片，并提供下载选项
3. WHEN 生成进行中时，THE Image_Editor SHALL 禁用生成按钮并显示加载动画
4. IF 生成失败，THEN THE Image_Editor SHALL 显示错误消息并重新启用生成按钮
5. WHEN 显示结果图片时，THE Gallery SHALL 提供下载按钮以本地保存图片

### 需求 3：定价页面

**用户故事：** 作为用户，我希望查看定价计划，以便选择适合我需求的订阅。

#### 验收标准

1. WHEN 用户导航到 /pricing 时，THE Pricing_Page SHALL 显示 3 个定价层级（Basic $12/月、Pro $19.50/月、Max $80/月）
2. THE Pricing_Page SHALL 显示年付选项并标注节省比例（年付最高节省 50%）
3. THE Pricing_Page SHALL 显示每个层级的积分数量和功能对比
4. THE Pricing_Page SHALL 为 Pro 层级显示"Most Popular"标签
5. THE Pricing_Page SHALL 包含数量调整选项（1x、10x 等）
6. THE Pricing_Page SHALL 显示定价相关的 FAQ 部分
7. THE Pricing_Page SHALL 保持香蕉主题的设计美学

### 需求 4：API 文档页面

**用户故事：** 作为开发者，我希望查看 API 文档，以便将图片编辑器集成到我的应用中。

#### 验收标准

1. WHEN 用户导航到 /api 时，THE API_Page SHALL 显示 API 端点文档
2. THE API_Page SHALL 包含多种语言的代码示例（JavaScript、Python、cURL）
3. THE API_Page SHALL 显示认证要求和速率限制
4. THE API_Page SHALL 提供"获取 API Key"的行动号召按钮

### 需求 5：独立生成器页面

**用户故事：** 作为用户，我希望访问完整的图片生成器页面，以便获得更强大的编辑功能。

#### 验收标准

1. WHEN 用户导航到 /generator 时，THE Generator_Page SHALL 显示完整的图片编辑界面
2. THE Generator_Page SHALL 包含 AI 模型选择（Nano Banana、SeeDream 4）
3. THE Generator_Page SHALL 包含分辨率设置选项（标准、2K、4K - 后两者需 VIP）
4. THE Generator_Page SHALL 显示参考图片上传区域（最多 9 张）
5. THE Generator_Page SHALL 包含"完成时通知我"选项
6. THE Generator_Page SHALL 显示生成提示和技巧

### 需求 6：移动端响应式导航

**用户故事：** 作为移动用户，我希望在小屏幕上访问导航，以便在手机上浏览网站。

#### 验收标准

1. WHEN 视口宽度低于 768px 时，THE Header SHALL 显示汉堡菜单图标
2. WHEN 用户点击汉堡菜单时，THE Header SHALL 显示移动导航抽屉
3. WHEN 在移动视图中点击导航链接时，THE drawer SHALL 自动关闭
4. THE 移动导航 SHALL 包含桌面导航中存在的所有链接

### 需求 7：深色模式支持

**用户故事：** 作为用户，我希望能够在浅色和深色主题之间切换，以便在不同光线条件下舒适地使用编辑器。

#### 验收标准

1. WHEN 用户点击主题切换按钮时，THE Header SHALL 在浅色和深色模式之间切换
2. WHILE 深色模式激活时，THE application SHALL 对所有组件应用深色配色方案
3. WHEN 页面加载时，THE application SHALL 尊重用户的系统颜色方案偏好
4. WHEN 主题偏好改变时，THE application SHALL 将选择持久化到本地存储

### 需求 8：法律页面

**用户故事：** 作为用户，我希望查看隐私政策和服务条款，以便了解我的权利和义务。

#### 验收标准

1. WHEN 用户导航到 /privacy 时，THE Privacy_Page SHALL 显示完整的隐私政策内容
2. WHEN 用户导航到 /terms 时，THE Terms_Page SHALL 显示完整的服务条款内容
3. THE 法律页面 SHALL 包含最后修改日期
4. THE 法律页面 SHALL 包含联系信息

### 需求 9：案例展示画廊改进

**用户故事：** 作为用户，我希望在案例展示中看到真实的示例图片，以便了解编辑器的功能。

#### 验收标准

1. THE ShowcaseSection SHALL 显示实际的占位图片而不是损坏的图片 URL
2. WHEN 用户悬停在案例卡片上时，THE card SHALL 显示放大预览或动画效果
3. THE ShowcaseSection SHALL 包含前后对比示例

### 需求 10：复制提示词功能

**用户故事：** 作为用户，我希望将提示词复制到剪贴板，以便重复使用或分享。

#### 验收标准

1. WHEN 用户点击提示词旁边的复制按钮时，THE Image_Editor SHALL 将提示词文本复制到剪贴板
2. WHEN 复制成功时，THE Image_Editor SHALL 显示简短的成功提示通知
3. IF 复制失败，THEN THE Image_Editor SHALL 显示错误通知

### 需求 11：平滑滚动导航

**用户故事：** 作为用户，我希望点击导航链接时有平滑滚动效果，使页面感觉精致现代。

#### 验收标准

1. WHEN 用户点击 Header 中的锚点链接时，THE page SHALL 平滑滚动到目标区域
2. THE 滚动动画 SHALL 在 500ms 内完成
3. WHEN 滚动完成时，THE URL hash SHALL 更新以反映当前区域

### 需求 12：公告横幅

**用户故事：** 作为网站运营者，我希望在页面顶部显示公告横幅，以便向用户推广新功能。

#### 验收标准

1. THE Header SHALL 显示"NEW: Nano Banana Pro is now live"公告横幅
2. THE 公告横幅 SHALL 包含"Try it now"链接
3. THE 公告横幅 SHALL 可以被用户关闭
