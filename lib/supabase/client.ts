import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
<<<<<<< HEAD
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
=======
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
>>>>>>> 5674addbae311b99c3360c6090232deb0fecd1fd
  )
}
