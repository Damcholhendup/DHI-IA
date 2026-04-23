'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatPanelProps {
  endpoint: 'master' | 'bhutan_telecom' | 'drukair'
  sessionId: string
  accentColor?: string
  label?: string
}

export default function ChatPanel({
  endpoint,
  sessionId,
  accentColor = '#00e5ff',
  label = 'AI Assistant',
}: ChatPanelProps) {
  const buildSessionId = useCallback(
    () => `${sessionId}-${endpoint}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    [sessionId, endpoint]
  )
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput]       = useState('')
  const [busy, setBusy]         = useState(false)
  const [open, setOpen]         = useState(false)
  const [mounted, setMounted]   = useState(false)
  const [drawerWidth, setDrawerWidth] = useState(460)
  const [activeSessionId, setActiveSessionId] = useState(buildSessionId)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLTextAreaElement>(null)
  const dragRef   = useRef<{ startX: number; startWidth: number } | null>(null)

  function autoResizeInput() {
    const el = inputRef.current
    if (!el) return
    el.style.height = '0px'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, busy])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80)
  }, [open])

  useEffect(() => {
    autoResizeInput()
  }, [input, open])

  useEffect(() => {
    setMessages([])
    setInput('')
    setActiveSessionId(buildSessionId())
  }, [buildSessionId])

  async function send() {
    const text = input.trim()
    if (!text || busy) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setBusy(true)
    try {
      const res = await fetch(`/api/chat-proxy/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, session_id: activeSessionId }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: { response: string } = await res.json()
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.response ?? 'No response received.' },
      ])
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Unable to reach the AI agent — please ensure Tailscale is active.' },
      ])
    } finally {
      setBusy(false)
      setTimeout(() => {
        autoResizeInput()
        inputRef.current?.focus()
      }, 50)
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  function startResize(e: React.MouseEvent) {
    e.preventDefault()
    dragRef.current = { startX: e.clientX, startWidth: drawerWidth }
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'col-resize'

    function onMouseMove(ev: MouseEvent) {
      if (!dragRef.current) return
      const delta = dragRef.current.startX - ev.clientX
      const newWidth = Math.min(900, Math.max(280, dragRef.current.startWidth + delta))
      setDrawerWidth(newWidth)
    }

    function onMouseUp() {
      dragRef.current = null
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  async function clearChat() {
    setMessages([])
    const currentSessionId = activeSessionId
    try {
      await fetch(`/api/chat-proxy/${encodeURIComponent(currentSessionId)}`, { method: 'DELETE' })
    } catch { /* best-effort */ }
    setInput('')
    setActiveSessionId(buildSessionId())
  }

  if (!mounted) return null

  return createPortal(
    <>
      {/* Backdrop — click outside to close */}
      {open && (
        <div
          className="fixed inset-0 top-14 z-[9990] bg-black/40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Full-height slide-in drawer — starts below the 56px header */}
      <div
        className="fixed top-14 right-0 z-[9991] flex flex-col border-l border-[#1a2744] shadow-2xl"
        style={{
          background: '#080e1f',
          width: `min(${drawerWidth}px, 100vw)`,
          height: 'calc(100vh - 3.5rem)',
          position: 'fixed',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
          overflowX: 'hidden',
        }}
      >
        {/* Drag-to-resize handle */}
        <div
          onMouseDown={startResize}
          className="absolute left-0 top-0 bottom-0 w-2 z-10 cursor-col-resize group"
        >
          <div
            className="absolute left-0.5 top-0 bottom-0 w-px opacity-20 group-hover:opacity-80 transition-opacity duration-150"
            style={{ background: accentColor }}
          />
        </div>

        {/* Header */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-[#1a2744]"
          style={{ background: '#060b18' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-semibold tracking-wide" style={{ color: accentColor }}>
              {label}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
              >
                New chat
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-[#1a2744] transition-colors"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 min-h-0">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 pb-16">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}30` }}
              >
                <svg width="24" height="24" fill="none" stroke={accentColor} viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  <path d="M8 10h8M8 14h5" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-300 mb-2">{label}</p>
                <p className="text-xs text-slate-600 leading-relaxed max-w-[280px]">
                  Ask anything about the data.<br />
                  e.g. &ldquo;What was revenue last month?&rdquo;
                </p>
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'user' ? (
                  <div className="max-w-[82%] rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-relaxed bg-[#1a2744] text-slate-100">
                    {m.content}
                  </div>
                ) : (
                  <div className="w-full rounded-2xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed bg-[#0c1425] border border-[#1a2744] text-slate-300 prose-chat">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ children }) => <p className="text-base font-bold text-slate-100 mt-3 mb-1.5">{children}</p>,
                        h2: ({ children }) => <p className="text-sm font-bold text-slate-100 mt-3 mb-1.5 border-b border-[#1a2744] pb-1">{children}</p>,
                        h3: ({ children }) => <p className="text-sm font-semibold text-slate-200 mt-2 mb-1">{children}</p>,
                        p:  ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                        strong: ({ children }) => <strong className="font-semibold text-slate-100">{children}</strong>,
                        em: ({ children }) => <em className="italic text-slate-400">{children}</em>,
                        hr: () => <hr className="border-[#1a2744] my-3" />,
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-2 border-slate-600 pl-3 my-2 text-slate-400 text-xs italic">{children}</blockquote>
                        ),
                        ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-2 text-slate-300">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-2 text-slate-300">{children}</ol>,
                        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                        code: ({ inline, children }: { inline?: boolean; children?: React.ReactNode }) =>
                          inline
                            ? <code className="bg-[#1a2744] text-cyan-300 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
                            : <pre className="bg-[#060b18] border border-[#1a2744] rounded-lg p-3 my-2 overflow-x-auto text-xs font-mono text-slate-300 leading-relaxed whitespace-pre">{children}</pre>,
                        table: ({ children }) => (
                          <div className="overflow-x-auto my-3">
                            <table className="w-full text-xs border-collapse">{children}</table>
                          </div>
                        ),
                        thead: ({ children }) => <thead>{children}</thead>,
                        tbody: ({ children }) => <tbody>{children}</tbody>,
                        tr: ({ children }) => <tr className="border-b border-[#1a2744]">{children}</tr>,
                        th: ({ children }) => (
                          <th className="text-left px-3 py-2 font-semibold text-slate-200 bg-[#0d1e35] whitespace-nowrap">{children}</th>
                        ),
                        td: ({ children }) => (
                          <td className="px-3 py-2 text-slate-300 border-r border-[#1a2744] last:border-r-0">{children}</td>
                        ),
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            ))
          )}

          {/* Typing indicator */}
          {busy && (
            <div className="flex justify-start">
              <div className="bg-[#0c1425] border border-[#1a2744] rounded-2xl rounded-bl-sm px-4 py-3.5">
                <div className="flex gap-1.5 items-center">
                  {[0, 150, 300].map(d => (
                    <span
                      key={d}
                      className="w-2 h-2 rounded-full bg-slate-600 animate-bounce"
                      style={{ animationDelay: `${d}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div
          className="flex-shrink-0 border-t border-[#1a2744] p-4"
          style={{ background: '#060b18' }}
        >
          <div className="flex gap-3 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              rows={1}
              placeholder="Ask about the data…"
              className="flex-1 min-h-[44px] max-h-40 resize-none overflow-y-auto bg-[#0c1425] border border-[#1a2744] rounded-xl px-4 py-3 text-sm leading-5 text-slate-300 placeholder-slate-700 focus:outline-none focus:border-cyan-500/40 transition-colors"
            />
            <button
              onClick={send}
              disabled={!input.trim() || busy}
              title="Send (Enter)"
              className="w-11 h-11 flex-shrink-0 rounded-xl flex items-center justify-center transition-all disabled:opacity-25 hover:brightness-110"
              style={{ background: `${accentColor}20`, color: accentColor, border: `1px solid ${accentColor}30` }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <p className="text-[10px] text-slate-700 mt-2 text-center">Press Enter to send</p>
        </div>
      </div>

      {/* Floating toggle button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          title="Open AI Assistant"
          className="fixed bottom-6 right-6 z-[9992] w-14 h-14 rounded-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          style={{
            background: '#0d1e35',
            border: `2px solid ${accentColor}`,
            color: accentColor,
            boxShadow: `0 0 18px ${accentColor}60, 0 4px 16px rgba(0,0,0,0.6)`,
          }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <path d="M8 10h8M8 14h5" />
          </svg>
        </button>
      )}
    </>,
    document.body
  )
}
