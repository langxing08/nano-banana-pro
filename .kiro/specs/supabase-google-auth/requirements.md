# Requirements Document

## Introduction

本功能为 Nano Banana AI 图像编辑器应用添加基于 Supabase 的 Google 登录认证功能。采用服务器端认证方式（SSR），使用 PKCE 流程确保安全性，支持 Google One-Tap 登录以提升用户体验。

## Glossary

- **Supabase_Client**: Supabase 客户端实例，用于与 Supabase 服务交互
- **Browser_Client**: 在浏览器端运行的 Supabase 客户端
- **Server_Client**: 在服务器端运行的 Supabase 客户端
- **Auth_Middleware**: 认证中间件，负责刷新过期的 Auth token 并管理 cookies
- **Google_One_Tap**: Google 提供的一键登录 UI 组件
- **PKCE_Flow**: Proof Key for Code Exchange，一种安全的 OAuth 2.0 授权流程
- **Session**: 用户会话，包含访问令牌和刷新令牌
- **Auth_Callback**: 认证回调端点，处理 OAuth 授权码交换

## Requirements

### Requirement 1: Supabase 客户端配置

**User Story:** 作为开发者，我希望配置 Supabase 客户端以支持服务器端认证，以便在 Next.js 应用中安全地管理用户会话。

#### Acceptance Criteria

1. THE Supabase_Client SHALL be configured with environment variables for SUPABASE_URL and SUPABASE_ANON_KEY
2. THE Browser_Client SHALL be created using @supabase/ssr package for client-side operations
3. THE Server_Client SHALL be created using @supabase/ssr package for server-side operations with cookie handling
4. THE Auth_Middleware SHALL refresh expired Auth tokens and update cookies automatically
5. WHEN the Auth_Middleware runs, THE System SHALL pass refreshed tokens to both server components and browser

### Requirement 2: Google OAuth 登录流程

**User Story:** 作为用户，我希望能够使用 Google 账号登录，以便快速安全地访问应用功能。

#### Acceptance Criteria

1. WHEN a user clicks the Google login button, THE System SHALL initiate the PKCE OAuth flow with Google
2. WHEN Google authorization completes, THE System SHALL redirect to the auth callback endpoint
3. WHEN the callback endpoint receives an authorization code, THE Auth_Callback SHALL exchange it for a session
4. WHEN session exchange succeeds, THE System SHALL save the session to cookies and redirect to the protected page
5. IF the authorization code exchange fails, THEN THE System SHALL display an error message and redirect to login page

### Requirement 3: Google One-Tap 登录

**User Story:** 作为用户，我希望看到 Google One-Tap 登录提示，以便更便捷地登录应用。

#### Acceptance Criteria

1. WHEN a user visits the application without an active session, THE Google_One_Tap SHALL display the sign-in prompt
2. WHEN a user has an existing session, THE Google_One_Tap SHALL NOT display the sign-in prompt
3. WHEN a user completes One-Tap sign-in, THE System SHALL use signInWithIdToken to create a session
4. THE Google_One_Tap SHALL use FedCM for compatibility with Chrome's third-party cookie phase-out
5. THE Google_One_Tap SHALL generate and verify a nonce for security

### Requirement 4: 会话管理

**User Story:** 作为用户，我希望我的登录状态能够被正确维护，以便在页面刷新后仍保持登录。

#### Acceptance Criteria

1. WHEN a user is authenticated, THE Session SHALL be stored in HTTP-only cookies
2. WHEN a session token expires, THE Auth_Middleware SHALL automatically refresh it
3. WHEN a user logs out, THE System SHALL clear all session cookies
4. THE Server_Client SHALL be able to retrieve the current session from cookies
5. THE Browser_Client SHALL be able to retrieve the current session from cookies

### Requirement 5: 用户界面集成

**User Story:** 作为用户，我希望在页面头部看到登录/登出按钮，以便方便地管理我的登录状态。

#### Acceptance Criteria

1. WHEN a user is not authenticated, THE Header SHALL display a "Sign in with Google" button
2. WHEN a user is authenticated, THE Header SHALL display the user's avatar and a logout button
3. WHEN a user clicks the logout button, THE System SHALL sign out the user and refresh the page
4. THE Header SHALL display a loading state while checking authentication status
5. WHEN authentication state changes, THE Header SHALL update immediately without page refresh

### Requirement 6: 受保护路由

**User Story:** 作为开发者，我希望能够保护特定路由只允许已登录用户访问，以便控制应用的访问权限。

#### Acceptance Criteria

1. WHEN an unauthenticated user accesses a protected route, THE System SHALL redirect to the login page
2. WHEN an authenticated user accesses a protected route, THE System SHALL allow access
3. THE Auth_Middleware SHALL check authentication status for all protected routes
4. THE System SHALL define a configurable list of protected route patterns

### Requirement 7: 错误处理

**User Story:** 作为用户，我希望在登录过程中遇到问题时能看到清晰的错误提示，以便了解发生了什么问题。

#### Acceptance Criteria

1. IF Google OAuth authorization fails, THEN THE System SHALL display a user-friendly error message
2. IF session creation fails, THEN THE System SHALL log the error and display an error message
3. IF token refresh fails, THEN THE System SHALL sign out the user and redirect to login
4. THE System SHALL handle network errors gracefully during authentication
