# Implementation Plan: Supabase Google Auth

## Overview

本实现计划将 Supabase Google 登录功能分解为可执行的编码任务。采用增量开发方式，每个任务都建立在前一个任务的基础上，确保代码始终处于可运行状态。

## Tasks

- [x] 1. 安装依赖并配置环境变量
  - 安装 @supabase/supabase-js 和 @supabase/ssr 包
  - 更新 .env.local 添加 Supabase 和 Google 环境变量
  - _Requirements: 1.1_

- [x] 2. 创建 Supabase 客户端工具函数
  - [x] 2.1 创建浏览器端客户端 `lib/supabase/client.ts`
    - 使用 createBrowserClient 创建客户端
    - 导出 createClient 函数
    - _Requirements: 1.2_
  
  - [x] 2.2 创建服务器端客户端 `lib/supabase/server.ts`
    - 使用 createServerClient 创建客户端
    - 实现 cookie 读写处理
    - _Requirements: 1.3_

- [x] 3. 实现认证中间件
  - [x] 3.1 创建 `middleware.ts` 文件
    - 实现 token 刷新逻辑
    - 实现 cookie 更新逻辑
    - 配置 matcher 排除静态资源
    - _Requirements: 1.4, 1.5_
  
  - [x] 3.2 添加受保护路由检查
    - 定义受保护路由列表
    - 实现未认证用户重定向逻辑
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [ ]* 3.3 编写中间件属性测试
    - **Property 4: Route Protection Enforcement**
    - **Validates: Requirements 6.1, 6.2, 6.3**

- [x] 4. 实现 OAuth 回调处理
  - [x] 4.1 创建 `app/auth/callback/route.ts`
    - 实现授权码交换逻辑
    - 实现成功后重定向
    - _Requirements: 2.3, 2.4_
  
  - [x] 4.2 创建错误页面 `app/auth/auth-code-error/page.tsx`
    - 显示认证错误信息
    - 提供返回首页链接
    - _Requirements: 2.5, 7.1_

- [x] 5. Checkpoint - 确保基础认证流程可用
  - 确保所有测试通过，如有问题请询问用户

- [x] 6. 实现认证按钮组件
  - [x] 6.1 创建 `components/auth-button.tsx`
    - 实现用户状态检测
    - 实现 Google OAuth 登录
    - 实现登出功能
    - 显示用户头像和信息
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  
  - [x] 6.2 监听认证状态变化
    - 使用 onAuthStateChange 监听状态变化
    - 实现无刷新 UI 更新
    - _Requirements: 5.5_
  
  - [ ]* 6.3 编写 AuthButton 属性测试
    - **Property 3: Header Auth State Display**
    - **Property 7: Auth State Change Reactivity**
    - **Validates: Requirements 5.1, 5.2, 5.5**

- [x] 7. 集成 AuthButton 到 Header
  - [x] 7.1 修改 `components/header.tsx`
    - 替换现有的 Sign In 按钮为 AuthButton 组件
    - 确保样式一致性
    - _Requirements: 5.1, 5.2_
  
  - [x] 7.2 修改 `components/mobile-nav.tsx`
    - 在移动端导航中添加认证按钮
    - _Requirements: 5.1, 5.2_

- [x] 8. 实现 Google One-Tap 登录
  - [x] 8.1 创建 `components/google-one-tap.tsx`
    - 实现 nonce 生成函数
    - 实现 Google One-Tap 初始化
    - 实现 signInWithIdToken 登录
    - 配置 FedCM 支持
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [x] 8.2 集成 GoogleOneTap 到布局
    - 在 `app/layout.tsx` 中添加 GoogleOneTap 组件
    - _Requirements: 3.1_
  
  - [ ]* 8.3 编写 Google One-Tap 属性测试
    - **Property 5: Google One-Tap Session-Based Display**
    - **Property 6: Nonce Generation Uniqueness**
    - **Validates: Requirements 3.1, 3.2, 3.5**

- [x] 9. Checkpoint - 确保完整登录流程可用
  - 确保所有测试通过，如有问题请询问用户

- [x] 10. 实现会话管理功能
  - [x] 10.1 创建会话工具函数 `lib/supabase/session.ts`
    - 实现 getSession 辅助函数
    - 实现 getUser 辅助函数
    - _Requirements: 4.1, 4.4, 4.5_
  
  - [ ]* 10.2 编写会话管理属性测试
    - **Property 2: Session Retrieval Consistency**
    - **Validates: Requirements 4.4, 4.5**

- [x] 11. 实现错误处理
  - [x] 11.1 添加错误处理逻辑
    - 在 AuthButton 中添加错误 toast 提示
    - 在 GoogleOneTap 中添加错误处理
    - _Requirements: 7.2, 7.3, 7.4_
  
  - [x] 11.2 处理 token 刷新失败
    - 在中间件中处理刷新失败情况
    - 实现自动登出和重定向
    - _Requirements: 7.3_

- [x] 12. Final Checkpoint - 确保所有功能完整
  - 确保所有测试通过，如有问题请询问用户

## Notes

- 标记为 `*` 的任务是可选的测试任务，可以跳过以加快 MVP 开发
- 每个任务都引用了具体的需求以确保可追溯性
- Checkpoint 任务用于确保增量验证
- 属性测试验证通用的正确性属性
- 单元测试验证具体的示例和边界情况
