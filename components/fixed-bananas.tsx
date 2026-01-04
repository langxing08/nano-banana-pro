'use client'

/**
 * 固定在页面两侧的香蕉装饰
 * 不随页面滚动而滚动
 */
export function FixedBananas() {
  return (
    <>
      {/* 左侧香蕉 */}
      <div 
        className="fixed left-4 top-1/2 -translate-y-1/2 text-8xl opacity-50 -rotate-12 select-none pointer-events-none z-0 hidden lg:block"
        aria-hidden="true"
      >
        🍌
      </div>
      
      {/* 右侧香蕉 */}
      <div 
        className="fixed right-4 top-1/2 -translate-y-1/2 text-8xl opacity-50 rotate-12 select-none pointer-events-none z-0 hidden lg:block"
        aria-hidden="true"
      >
        🍌
      </div>
    </>
  )
}
