'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: 'Bonjour ! Bienvenue chez OLGA. Comment puis-je vous aider aujourd\'hui ? Je peux vous aider à trouver des produits, vérifier le statut de vos commandes, ou répondre à vos questions sur nos collections.'
    }])
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)

    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      })

      if (!response.ok) throw new Error('Failed to send message')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error('No response body')

      let assistantMessage = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(5)
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                assistantMessage += parsed.content
                setMessages(prev => {
                  const newMessages = [...prev]
                  newMessages[newMessages.length - 1] = {
                    role: 'assistant',
                    content: assistantMessage
                  }
                  return newMessages
                })
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => {
        const newMessages = [...prev]
        newMessages[newMessages.length - 1] = {
          role: 'assistant',
          content: 'Désolée, une erreur est survenue. Veuillez réessayer.'
        }
        return newMessages
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(e as unknown as React.FormEvent)
    }
  }

  const suggestions = [
    'Voir les nouvellescollections',
    'Prix d\'une robe caftan',
    'Suivre ma commande',
    'Livraisons et retours'
  ]

  return (
    <div className="chat-page">
      <div className="chat-header">
        <div className="chat-header-content">
          <div className="chat-avatar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--espresso)" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="chat-title">Assistant OLGA</h1>
            <p className="chat-subtitle">Mode féminine marocaine depuis 1999</p>
          </div>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-message ${msg.role === 'user' ? 'chat-message-user' : 'chat-message-assistant'}`}
          >
            <div className="chat-bubble">
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="chat-message chat-message-assistant">
            <div className="chat-bubble">
              <div className="chat-typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 1 && (
        <div className="chat-suggestions">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              className="chat-suggestion-btn"
              onClick={() => {
                setInput(suggestion)
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={sendMessage} className="chat-input-form">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tapez votre message..."
          rows={1}
          className="chat-input"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="chat-send-btn"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </form>

      <style jsx>{`
        .chat-page {
          min-height: calc(100vh - var(--nav-h) - 38px);
          display: flex;
          flex-direction: column;
          background: var(--ivory);
        }

        .chat-header {
          padding: 2rem 3rem;
          background: var(--espresso);
          border-bottom: 1px solid rgba(196, 168, 130, 0.1);
        }

        .chat-header-content {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .chat-avatar {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: var(--sand);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-title {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 300;
          color: var(--sand-light);
          letter-spacing: 0.1em;
          margin: 0;
        }

        .chat-subtitle {
          font-size: 0.7rem;
          color: rgba(232, 217, 197, 0.5);
          margin: 0.25rem 0 0;
          letter-spacing: 0.08em;
        }

        .chat-messages {
          flex: 1;
          padding: 2rem 3rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          max-width: 800px;
          margin: 0 auto;
          width: 100;
        }

        .chat-message {
          display: flex;
        }

        .chat-message-user {
          justify-content: flex-end;
        }

        .chat-message-assistant {
          justify-content: flex-start;
        }

        .chat-bubble {
          max-width: 75%;
          padding: 1rem 1.25rem;
          border-radius: 12px;
          font-size: 0.9rem;
          line-height: 1.6;
        }

        .chat-message-user .chat-bubble {
          background: var(--espresso);
          color: var(--sand-light);
          border-bottom-right-radius: 3px;
        }

        .chat-message-assistant .chat-bubble {
          background: var(--ivory-warm);
          color: var(--charcoal);
          border-bottom-left-radius: 3px;
        }

        .chat-typing {
          display: flex;
          gap: 4px;
          padding: 4px 0;
        }

        .chat-typing span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--sand);
          animation: typing 1s infinite;
        }

        .chat-typing span:nth-child(2) {
          animation-delay: 0.15s;
        }

        .chat-typing span:nth-child(3) {
          animation-delay: 0.3s;
        }

        @keyframes typing {
          0%, 80%, 100% { opacity: 0.4; transform: translateY(0); }
          40% { opacity: 1; transform: translateY(-4px); }
        }

        .chat-suggestions {
          padding: 0 3rem 1.5rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          justify-content: center;
          max-width: 800px;
          margin: 0 auto;
          width: 100%;
        }

        .chat-suggestion-btn {
          padding: 0.65rem 1.25rem;
          border-radius: 20px;
          border: 1px solid var(--ivory-deep);
          background: var(--white);
          color: var(--charcoal);
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s;
          font-family: var(--font-body);
        }

        .chat-suggestion-btn:hover {
          border-color: var(--sand);
          background: var(--ivory-warm);
        }

        .chat-input-form {
          padding: 1.5rem 3rem 2.5rem;
          display: flex;
          gap: 0.75rem;
          background: var(--white);
          border-top: 1px solid var(--ivory-warm);
          max-width: 800px;
          margin: 0 auto;
          width: 100%;
        }

        .chat-input {
          flex: 1;
          padding: 0.85rem 1.25rem;
          border-radius: 8px;
          border: 1px solid var(--ivory-deep);
          background: var(--ivory);
          font-size: 0.9rem;
          font-family: var(--font-body);
          resize: none;
          outline: none;
          min-height: 48px;
          max-height: 120px;
          color: var(--charcoal);
        }

        .chat-input:focus {
          border-color: var(--sand);
        }

        .chat-send-btn {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          background: var(--espresso);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
          color: var(--sand-light);
        }

        .chat-send-btn:disabled {
          background: var(--ivory-warm);
          cursor: not-allowed;
          color: var(--mid-gray);
        }

        .chat-send-btn:not(:disabled):hover {
          background: var(--charcoal);
        }

        @media (max-width: 768px) {
          .chat-header {
            padding: 1.5rem 1.25rem;
          }

          .chat-messages {
            padding: 1.5rem 1.25rem;
          }

          .chat-suggestions {
            padding: 0 1.25rem 1.25rem;
          }

          .chat-input-form {
            padding: 1.25rem;
          }
        }
      `}</style>
    </div>
  )
}