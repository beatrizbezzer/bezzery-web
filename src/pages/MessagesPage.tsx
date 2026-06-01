import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Avatar } from '../components/ui/Avatar'
import { useAuthStore } from '../store/authStore'
import {
  getConversations,
  openConversation,
  getMessages,
  sendMessage,
  type Conversation,
  type Message,
} from '../api/messages'

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  if (diffMins < 1) return 'agora'
  if (diffMins < 60) return `${diffMins}m`
  if (diffHours < 24) return `${diffHours}h`
  if (diffDays < 7) return `${diffDays}d`
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
}

export const MessagesPage: React.FC = () => {
  const { user } = useAuthStore()
  const [searchParams] = useSearchParams()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConvId, setActiveConvId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [sending, setSending] = useState(false)
  const [loadingConvs, setLoadingConvs] = useState(true)
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const activeConvIdRef = useRef<string | null>(null)

  const activeConv = conversations.find((c) => c.id === activeConvId) ?? null

  useEffect(() => { activeConvIdRef.current = activeConvId }, [activeConvId])

  // Load conversations list
  const loadConversations = useCallback(async () => {
    try {
      const convs = await getConversations()
      setConversations(convs)
    } catch {
      // ignore
    } finally {
      setLoadingConvs(false)
    }
  }, [])

  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  // Open conversation from query param ?with=userId
  useEffect(() => {
    const withUserId = searchParams.get('with')
    if (!withUserId) return
    openConversation(withUserId)
      .then((conv) => {
        setConversations((prev) => {
          if (prev.find((c) => c.id === conv.id)) return prev
          return [conv, ...prev]
        })
        setActiveConvId(conv.id)
      })
      .catch(() => { /* ignore if not mutual follows */ })
  }, [searchParams])

  // Load messages when active conversation changes
  useEffect(() => {
    if (!activeConvId) return
    setLoadingMsgs(true)
    setMessages([])
    getMessages(activeConvId)
      .then((msgs) => setMessages(msgs))
      .catch(() => { /* ignore */ })
      .finally(() => setLoadingMsgs(false))
  }, [activeConvId])

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Real-time messages via window event dispatched by useUnreadMessages
  useEffect(() => {
    const handler = (e: Event) => {
      const data = (e as CustomEvent).detail
      const incomingMsg: Message = data.message
      const currentConvId = activeConvIdRef.current
      if (data.conversationId === currentConvId) {
        setMessages((prev) => {
          if (prev.find((m) => m.id === incomingMsg.id)) return prev
          return [...prev, incomingMsg]
        })
      }
      setConversations((prev) =>
        prev.map((c) =>
          c.id === data.conversationId
            ? {
                ...c,
                lastMessage: {
                  content: incomingMsg.content,
                  senderId: incomingMsg.senderId,
                  createdAt: incomingMsg.createdAt,
                  read: data.conversationId === currentConvId,
                },
              }
            : c
        )
      )
    }
    window.addEventListener('bz:message', handler)
    return () => window.removeEventListener('bz:message', handler)
  }, [])

  const handleSend = async () => {
    if (!activeConvId || !inputText.trim() || sending) return
    setSending(true)
    const text = inputText.trim()
    setInputText('')
    try {
      const msg = await sendMessage(activeConvId, text)
      setMessages((prev) => [...prev, msg])
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId
            ? { ...c, lastMessage: { content: msg.content, senderId: msg.senderId, createdAt: msg.createdAt, read: true } }
            : c
        )
      )
    } catch {
      setInputText(text)
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen bg-bz-black">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-4 h-[calc(100vh-120px)]">
          {/* Conversations list */}
          <div className="w-80 flex-shrink-0 bg-bz-card border border-bz-surface rounded-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-bz-surface">
              <h2 className="font-syne font-bold text-bz-white text-lg">Mensagens</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loadingConvs ? (
                <div className="flex items-center justify-center h-32 text-bz-white/40 text-sm">
                  Carregando...
                </div>
              ) : conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 gap-2 text-center px-6">
                  <p className="text-bz-white/40 text-sm">Nenhuma conversa ainda</p>
                  <p className="text-bz-white/25 text-xs">Acesse o perfil de um amigo que te segue de volta para mandar uma mensagem</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={[
                      'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-150 cursor-pointer',
                      activeConvId === conv.id
                        ? 'bg-bz-electric/10 border-l-2 border-bz-electric'
                        : 'hover:bg-bz-surface border-l-2 border-transparent',
                    ].join(' ')}
                  >
                    <Avatar src={conv.otherUser?.avatarUrl} name={conv.otherUser?.name ?? '?'} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-sm font-semibold text-bz-white truncate">
                          {conv.otherUser?.name ?? 'Usuário'}
                        </span>
                        {conv.lastMessage && (
                          <span className="text-xs text-bz-white/30 flex-shrink-0">
                            {formatTime(conv.lastMessage.createdAt)}
                          </span>
                        )}
                      </div>
                      {conv.lastMessage && (
                        <p className="text-xs text-bz-white/40 truncate">
                          {conv.lastMessage.senderId === user?.id ? 'Você: ' : ''}
                          {conv.lastMessage.content}
                        </p>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 bg-bz-card border border-bz-surface rounded-xl flex flex-col overflow-hidden">
            {!activeConv ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-8">
                <div className="w-16 h-16 rounded-full bg-bz-surface flex items-center justify-center">
                  <svg className="w-8 h-8 text-bz-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-bz-white/40 text-sm">Selecione uma conversa para começar</p>
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-bz-surface flex-shrink-0">
                  <Avatar src={activeConv.otherUser?.avatarUrl} name={activeConv.otherUser?.name ?? '?'} size="md" />
                  <div>
                    <p className="font-semibold text-bz-white text-sm">{activeConv.otherUser?.name}</p>
                    <p className="text-xs text-bz-white/40 font-mono">@{activeConv.otherUser?.username}</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                  {loadingMsgs ? (
                    <div className="flex items-center justify-center h-full text-bz-white/40 text-sm">
                      Carregando mensagens...
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-bz-white/30 text-sm">
                      Nenhuma mensagem ainda. Diga olá!
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.senderId === user?.id
                      return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          {!isMe && (
                            <Avatar
                              src={msg.sender.avatarUrl}
                              name={msg.sender.name}
                              size="sm"
                              className="mr-2 flex-shrink-0 self-end"
                            />
                          )}
                          <div
                            className={[
                              'max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words',
                              isMe
                                ? 'bg-bz-electric text-bz-black font-medium rounded-br-sm'
                                : 'bg-bz-surface text-bz-white rounded-bl-sm',
                            ].join(' ')}
                          >
                            {msg.content}
                            <span className={`block text-[10px] mt-1 ${isMe ? 'text-bz-black/50 text-right' : 'text-bz-white/30 text-right'}`}>
                              {formatTime(msg.createdAt)}
                            </span>
                          </div>
                        </div>
                      )
                    })
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="px-4 py-3 border-t border-bz-surface flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Mensagem..."
                      className="flex-1 bg-bz-surface border border-bz-surface/60 rounded-xl px-4 py-2.5 text-sm text-bz-white placeholder-bz-white/30 outline-none focus:border-bz-electric/50 transition-colors"
                    />
                    <button
                      onClick={handleSend}
                      disabled={sending || !inputText.trim()}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-bz-electric text-bz-black hover:shadow-[0_0_12px_rgba(0,245,196,0.4)] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex-shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
