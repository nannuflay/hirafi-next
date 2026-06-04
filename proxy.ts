import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { locales, defaultLocale } from './app/[lang]/dictionaries'

// ── Locale detection ──────────────────────────────────────────────────────────

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language') ?? ''
  const headers = { 'accept-language': acceptLanguage }
  const languages = new Negotiator({ headers }).languages()
  try {
    return match(languages, locales as unknown as string[], defaultLocale)
  } catch {
    return defaultLocale
  }
}

// ── Proxy ─────────────────────────────────────────────────────────────────────

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip locale redirect for internal paths and static assets
  const isInternal =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth') ||
    pathname.includes('.')

  if (!isInternal) {
    const pathnameHasLocale = locales.some(
      (locale) =>
        pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )

    if (!pathnameHasLocale) {
      const locale = getLocale(request)
      request.nextUrl.pathname = `/${locale}${pathname}`
      return NextResponse.redirect(request.nextUrl)
    }
  }

  // ── Supabase session refresh ──────────────────────────────────────────────

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run any logic between createServerClient and getUser.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const locale = pathname.split('/')[1] ?? defaultLocale

  // Protect dashboard routes
  if (pathname.match(/^\/[a-z]{2}\/dashboard/) && !user) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
  }

  // Redirect authenticated users away from auth pages
  if (pathname.match(/^\/[a-z]{2}\/(login|signup)$/) && user) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
