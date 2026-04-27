'use client'
import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'bot'
  text: string
}

const INITIAL_MSG: Message = {
  role: 'bot',
  text: 'Bonjour ! Bienvenue chez OLGA. Comment puis-je vous aider aujourd\'hui ?',
}

const DEFAULT_SUGGESTIONS = ['Livraison', 'Retours & échanges', 'Nos boutiques', 'Contact']

export function ChatbotFab() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([INITIAL_MSG])
  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_SUGGESTIONS)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  async function send(text: string) {
    if (!text.trim() || loading) return
    const userMsg: Message = { role: 'user', text: text.trim() }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)
    setSuggestions([])

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim() }),
      })
      const data = await res.json()
      setMessages((m) => [...m, { role: 'bot', text: data.reply }])
      setSuggestions(data.suggestions || DEFAULT_SUGGESTIONS)
    } catch {
      setMessages((m) => [...m, { role: 'bot', text: 'Une erreur est survenue. Veuillez réessayer.' }])
      setSuggestions(DEFAULT_SUGGESTIONS)
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    send(input)
  }

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed',
          bottom: '5.5rem',
          right: '2rem',
          zIndex: 9001,
          width: 'min(360px, calc(100vw - 2rem))',
          background: 'var(--ivory, #FAF7F2)',
          border: '1px solid rgba(196,168,130,0.25)',
          borderRadius: '1rem',
          boxShadow: '0 8px 40px rgba(61,46,36,0.18)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          maxHeight: '70vh',
        }}>
          {/* Header */}
          <div style={{
            background: 'var(--espresso, #3D2E24)',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ color: 'var(--sand-light, #C4A882)', fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 300, letterSpacing: '0.08em' }}>OLGA</div>
              <div style={{ color: 'rgba(196,168,130,0.6)', fontSize: '0.72rem', letterSpacing: '0.05em' }}>Service client</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Fermer"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(196,168,130,0.7)', padding: '0.25rem' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}>
                <div style={{
                  maxWidth: '80%',
                  padding: '0.6rem 0.9rem',
                  borderRadius: msg.role === 'user' ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
                  background: msg.role === 'user' ? 'var(--espresso, #3D2E24)' : 'white',
                  color: msg.role === 'user' ? 'var(--sand-light, #C4A882)' : 'var(--charcoal, #1A1614)',
                  fontSize: '0.82rem',
                  lineHeight: 1.6,
                  border: msg.role === 'bot' ? '1px solid rgba(196,168,130,0.15)' : 'none',
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '0.6rem 0.9rem', background: 'white', border: '1px solid rgba(196,168,130,0.15)', borderRadius: '1rem 1rem 1rem 0.25rem', fontSize: '0.82rem', color: 'var(--warm-gray)' }}>
                  <span style={{ letterSpacing: '0.2em' }}>···</span>
                </div>
              </div>
            )}
            {/* Suggestion chips */}
            {!loading && suggestions.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.25rem' }}>
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    style={{
                      background: 'white',
                      border: '1px solid rgba(196,168,130,0.35)',
                      borderRadius: '2rem',
                      padding: '0.3rem 0.75rem',
                      fontSize: '0.75rem',
                      color: 'var(--espresso, #3D2E24)',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} style={{
            borderTop: '1px solid rgba(196,168,130,0.15)',
            padding: '0.75rem 1rem',
            display: 'flex',
            gap: '0.5rem',
            background: 'white',
          }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Votre message…"
              disabled={loading}
              style={{
                flex: 1,
                border: '1px solid rgba(196,168,130,0.25)',
                borderRadius: '2rem',
                padding: '0.5rem 1rem',
                fontSize: '0.82rem',
                outline: 'none',
                background: 'var(--ivory, #FAF7F2)',
                color: 'var(--charcoal)',
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Envoyer"
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'var(--espresso, #3D2E24)',
                border: 'none',
                cursor: input.trim() && !loading ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                opacity: input.trim() && !loading ? 1 : 0.4,
                transition: 'opacity 0.2s',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#E8D9C5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* FAB button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Fermer le chat' : 'Ouvrir le chat'}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 9001,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'var(--espresso, #3D2E24)',
          border: '1px solid rgba(196,168,130,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 24px rgba(61,46,36,0.25)',
          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        }}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8D9C5" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E8D9C5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
      </button>
    </>
  )
}
