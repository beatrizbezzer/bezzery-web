import { useEffect, useState, useCallback, useRef } from 'react'
import { useAuthStore } from '../store/authStore'
import { supabase } from '../lib/supabase'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

export function useNotifications() {
  const { isAuthenticated } = useAuthStore()
  const [unreadCount, setUnreadCount] = useState(0)
  const esRef = useRef<EventSource | null>(null)

  const connect = useCallback(async () => {
    if (!isAuthenticated) return
    if (esRef.current) return

    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) return

    const es = new EventSource(`${API_URL}/notifications/stream?token=${session.access_token}`)
    esRef.current = es

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        if (data.type === 'init') setUnreadCount(data.unreadCount)
        else if (data.type === 'notification') setUnreadCount((c) => c + 1)
      } catch { /* ignore malformed */ }
    }

    es.onerror = () => {
      es.close()
      esRef.current = null
    }
  }, [isAuthenticated])

  useEffect(() => {
    connect()
    return () => {
      esRef.current?.close()
      esRef.current = null
    }
  }, [connect])

  const markAllRead = useCallback(() => setUnreadCount(0), [])

  return { unreadCount, markAllRead }
}
