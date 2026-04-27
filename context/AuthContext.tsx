'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import type { AuthProfile } from '@/types'

type AuthContextValue = {
  user: User | null
  profile: AuthProfile | null
  isLoggedIn: boolean
  isLoading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function toInitials(firstName?: string | null, lastName?: string | null, fullName?: string | null) {
  const first = firstName?.[0] ?? fullName?.[0] ?? ''
  const second = lastName?.[0] ?? fullName?.split(' ')[1]?.[0] ?? ''
  return `${first}${second}`.toUpperCase()
}

async function fetchProfile(userId: string): Promise<AuthProfile | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, full_name, email, newsletter_opt_in, avatar_url, created_at')
    .eq('id', userId)
    .maybeSingle()

  if (error || !data) return null

  return {
    ...data,
    newsletter_opt_in: !!data.newsletter_opt_in,
    avatar_initials: toInitials(data.first_name, data.last_name, data.full_name),
  } as AuthProfile
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<AuthProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  async function refreshProfile() {
    if (!user) {
      setProfile(null)
      return
    }
    const nextProfile = await fetchProfile(user.id)
    setProfile(nextProfile)
  }

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getSession().then(async ({ data }) => {
      const nextUser = data.session?.user ?? null
      setUser(nextUser)
      if (nextUser) {
        const nextProfile = await fetchProfile(nextUser.id)
        setProfile(nextProfile)
      }
      setIsLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const nextUser = session?.user ?? null
      setUser(nextUser)
      if (nextUser) {
        const nextProfile = await fetchProfile(nextUser.id)
        setProfile(nextProfile)
      } else {
        setProfile(null)
      }
      setIsLoading(false)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      isLoggedIn: !!user,
      isLoading,
      signOut: async () => {
        await createClient().auth.signOut()
      },
      refreshProfile,
    }),
    [user, profile, isLoading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
