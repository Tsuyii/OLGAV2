'use client'
import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface ToastContextValue {
  showToast: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('✓ Ajouté au panier')
  const [visible, setVisible] = useState(false)

  const showToast = useCallback((msg: string) => {
    setMessage(msg)
    setVisible(true)
    setTimeout(() => setVisible(false), 2500)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className={`toast${visible ? ' show' : ''}`}>{message}</div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
