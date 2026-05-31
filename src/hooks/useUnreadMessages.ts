import { useEffect, useState, useCallback, useRef } from 'react'
import { useAuthStore } from '../store/authStore'
import { supabase } from '../lib/supabase'
import { getUnreadMessageCount } from '../api/messages'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

export function useUnreadMessages() {
  const { isAuthenticated } = useAuthStore()
  const [unreadMessages, setUnreadMessages] = useState(0)
  const esRef = useRef<EventSource | null>(null)

  const fetchCount = useCallback(async () => {
    if (!isAuthenticated) return
    try {
      const count = await getUnreadMessageCount()
      setUnreadMessages(count)
    } catch { /* ignore */ }
  }, [isAuthenticated])

  useEffect(() => {
    fetchCount()
  }, [fetchCount])

  useEffect(() => {
    if (!isAuthenticated) return
    let es: EventSource | null = null
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.access_token) return
      es = new EventSource(`${API_URL}/notifications/stream?token=${session.access_token}`)
      esRef.current = es
      es.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data)
          if (data.type === 'message') {
            setUnreadMessages((c) => c + 1)
          }
        } catch { /* ignore */ }
      }
      es.onerror = () => { es?.close(); esRef.current = null }
    })
    return () => { es?.close(); esRef.current = null }
  }, [isAuthenticated])

  const clearUnread = useCallback(() => setUnreadMessages(0), [])

  return { unreadMessages, clearUnread }
}
