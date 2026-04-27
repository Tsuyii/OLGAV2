type AuthContext = 'login' | 'signup' | 'reset' | 'update-password'

function normalizeMessage(input: unknown): string {
  if (!input) return ''
  if (typeof input === 'string') return input.toLowerCase()
  if (typeof input === 'object' && input && 'message' in input) {
    const value = (input as { message?: unknown }).message
    return typeof value === 'string' ? value.toLowerCase() : ''
  }
  return ''
}

export function mapSupabaseAuthError(error: unknown, context: AuthContext): string {
  const message = normalizeMessage(error)

  if (message.includes('email not confirmed')) {
    return 'Please verify your email first.'
  }

  if (message.includes('invalid login credentials')) {
    return 'Incorrect email or password.'
  }

  if (message.includes('too many requests') || message.includes('rate limit')) {
    return 'Too many attempts. Please wait 30 seconds.'
  }

  if (message.includes('password should be at least')) {
    return 'Password does not meet security requirements.'
  }

  if (message.includes('user already registered')) {
    return 'An account with this email already exists. Try signing in instead.'
  }

  if (context === 'reset') {
    return 'If this email exists, a reset link was sent.'
  }

  if (context === 'signup') {
    return 'Unable to create your account right now. Please try again.'
  }

  if (context === 'update-password') {
    return 'Unable to update password. Please request a new reset link.'
  }

  return 'Unable to sign in right now. Please try again.'
}
