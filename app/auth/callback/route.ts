import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
<<<<<<< HEAD
  const next = searchParams.get('next')
  const safeNext = next?.startsWith('/') ? next : '/compte'
=======
>>>>>>> 5674addbae311b99c3360c6090232deb0fecd1fd
  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }
<<<<<<< HEAD
  return NextResponse.redirect(`${origin}${safeNext}`)
=======
  return NextResponse.redirect(`${origin}/compte`)
>>>>>>> 5674addbae311b99c3360c6090232deb0fecd1fd
}
