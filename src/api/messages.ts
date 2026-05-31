import client from './client'

export interface ConversationUser {
  id: string
  username: string
  name: string
  avatarUrl?: string
}

export interface LastMessage {
  content: string
  senderId: string
  createdAt: string
  read: boolean
}

export interface Conversation {
  id: string
  createdAt: string
  otherUser: ConversationUser | null
  lastMessage: LastMessage | null
  unreadCount: number
}

export interface Message {
  id: string
  content: string
  senderId: string
  sender: ConversationUser
  conversationId: string
  read: boolean
  createdAt: string
}

export async function getConversations(): Promise<Conversation[]> {
  const { data } = await client.get('/conversations')
  return data
}

export async function openConversation(userId: string): Promise<Conversation> {
  const { data } = await client.post('/conversations', { userId })
  return data
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const { data } = await client.get(`/conversations/${conversationId}/messages`)
  return data
}

export async function sendMessage(conversationId: string, content: string): Promise<Message> {
  const { data } = await client.post(`/conversations/${conversationId}/messages`, { content })
  return data
}

export async function getUnreadMessageCount(): Promise<number> {
  const { data } = await client.get('/conversations/unread-count')
  return data.count
}
