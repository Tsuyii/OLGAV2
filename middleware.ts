import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet: { name: string; value: string; options?: any }[]) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && request.nextUrl.pathname.startsWith('/compte')) {
<<<<<<< HEAD
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (user && request.nextUrl.pathname.startsWith('/auth/')) {
    return NextResponse.redirect(new URL('/compte', request.url))
=======
    return NextResponse.redirect(new URL('/auth/login', request.url))
>>>>>>> 5674addbae311b99c3360c6090232deb0fecd1fd
  }

  return supabaseResponse
}

export const config = {
<<<<<<< HEAD
  matcher: ['/compte/:path*', '/auth/:path*'],
=======
  matcher: ['/compte/:path*'],
>>>>>>> 5674addbae311b99c3360c6090232deb0fecd1fd
}
