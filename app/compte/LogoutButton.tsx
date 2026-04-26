'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()
  async function logout() {
    await createClient().auth.signOut()
    router.push('/')
  }
  return <button className="btn btn-outline" onClick={logout}>Se déconnecter</button>
}
