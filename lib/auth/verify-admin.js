import { createClient } from '@/lib/supabase/server';

export async function verifyAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { ok: false, status: 401, message: 'Sign in required.' };
  }

  const email = user.email.toLowerCase();
  const { data: allowed } = await supabase
    .from('admin_allowlist')
    .select('email')
    .eq('email', email)
    .maybeSingle();

  if (!allowed) {
    return { ok: false, status: 403, message: 'Not authorized.' };
  }

  return { ok: true, user };
}
