'use client'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const { signOut } = useAuth()
  const router = useRouter()

  async function logout() {
    await signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button className="btn btn-outline" onClick={logout}>
      Se déconnecter
    </button>
  )
}
