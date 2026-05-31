import axios from 'axios'
import { supabase } from '../lib/supabase'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333',
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }
  return config
})

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await supabase.auth.signOut()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default client
