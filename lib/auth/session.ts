export function getAuthCallbackUrl(): string {
  if (typeof window === 'undefined') return '/auth/callback'
  return `${window.location.origin}/auth/callback`
}

export function getResetPasswordUrl(): string {
  if (typeof window === 'undefined') return '/auth/reset-password'
  return `${window.location.origin}/auth/reset-password`
}
