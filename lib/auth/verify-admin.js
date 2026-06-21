import { createClient } from '@/lib/supabase/server';
import { isAllowedAdmin } from '@/lib/auth/is-allowed-admin';

export async function verifyAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { ok: false, status: 401, message: 'Sign in required.' };
  }

  const allowed = await isAllowedAdmin(supabase);

  if (!allowed) {
    return { ok: false, status: 403, message: 'Not authorized.' };
  }

  return { ok: true, user };
}
