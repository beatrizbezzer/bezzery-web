import { useEffect, useState, useCallback, useRef } from 'react'
import { useAuthStore } from '../store/authStore'
import { supabase } from '../lib/supabase'
import { getUnreadMessageCount } from '../api/messages'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'
const RECONNECT_DELAY = 5000

export function useUnreadMessages() {
  const { isAuthenticated } = useAuthStore()
  const [unreadMessages, setUnreadMessages] = useState(0)
  const esRef = useRef<EventSource | null>(null)
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const destroyedRef = useRef(false)

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

    destroyedRef.current = false

    const connect = async () => {
      if (destroyedRef.current) return
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token || destroyedRef.current) return

      const es = new EventSource(`${API_URL}/notifications/stream?token=${session.access_token}`)
      esRef.current = es

      es.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data)
          if (data.type === 'message') {
            window.dispatchEvent(new CustomEvent('bz:message', { detail: data }))
            setUnreadMessages((c) => c + 1)
          }
        } catch { /* ignore */ }
      }

      es.onerror = () => {
        es.close()
        esRef.current = null
        if (!destroyedRef.current) {
          retryRef.current = setTimeout(connect, RECONNECT_DELAY)
        }
      }
    }

    connect()

    return () => {
      destroyedRef.current = true
      if (retryRef.current) clearTimeout(retryRef.current)
      esRef.current?.close()
      esRef.current = null
    }
  }, [isAuthenticated])

  const clearUnread = useCallback(() => setUnreadMessages(0), [])

  return { unreadMessages, clearUnread }
}
