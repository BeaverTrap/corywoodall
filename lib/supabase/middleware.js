import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isStudioRoute = pathname.startsWith('/studio');
  const isStudioLogin = pathname === '/studio/login';
  const isAuthCallback = pathname.startsWith('/auth/');

  if (isStudioRoute && !isStudioLogin && !isAuthCallback) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/studio/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }

    const email = user.email?.toLowerCase();
    const { data: allowed } = await supabase
      .from('admin_allowlist')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (!allowed) {
      await supabase.auth.signOut();
      const url = request.nextUrl.clone();
      url.pathname = '/studio/login';
      url.searchParams.set('error', 'not_authorized');
      return NextResponse.redirect(url);
    }
  }

  if (isStudioLogin && user) {
    const email = user.email?.toLowerCase();
    const { data: allowed } = await supabase
      .from('admin_allowlist')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (allowed) {
      const url = request.nextUrl.clone();
      url.pathname = '/studio';
      url.search = '';
      return NextResponse.redirect(url);
    }
  }

  supabaseResponse.headers.set('Cache-Control', 'private, no-store');
  return supabaseResponse;
}
