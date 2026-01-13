import { createClient } from './server'
import type { User, Session } from '@supabase/supabase-js'

/**
 * 服务器端获取当前会话
 * Requirements: 4.1, 4.4
 */
export async function getSession(): Promise<Session | null> {
  try {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Error getting session:', error)
      return null
    }
    
    return session
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

/**
 * 服务器端获取当前用户
 * Requirements: 4.4
 */
export async function getUser(): Promise<User | null> {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Error getting user:', error)
      return null
    }
    
    return user
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

/**
 * 检查用户是否已认证
 * Requirements: 4.4
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getUser()
  return user !== null
}
