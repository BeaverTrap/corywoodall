import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isAllowedAdmin } from '@/lib/auth/is-allowed-admin';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/studio';

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        const allowed = await isAllowedAdmin(supabase, user.email);

        if (!allowed) {
          await supabase.auth.signOut();
          return NextResponse.redirect(`${origin}/studio/login?error=not_authorized`);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/studio/login?error=auth_failed`);
}
