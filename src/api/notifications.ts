import client from './client'
import type { Notification } from '../types'

export const getNotifications = async (): Promise<{ notifications: Notification[]; unreadCount: number }> => {
  const { data } = await client.get<{ notifications: Notification[]; unreadCount: number }>('/notifications')
  return data
}

export const markNotificationsRead = async (): Promise<void> => {
  await client.put('/notifications/read')
}
