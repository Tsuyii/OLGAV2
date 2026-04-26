// Floating chatbot button — UI only, no functionality yet
export function ChatbotFab() {
  return (
    <button
      aria-label="Ouvrir le chat"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 9000,
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: 'var(--espresso)',
        border: '1px solid rgba(196,168,130,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 24px rgba(61,46,36,0.25)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#E8D9C5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  )
}
