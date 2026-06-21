import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import AllowlistManager from './AllowlistManager';

export const dynamic = 'force-dynamic';

export default async function AdminsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: entries } = await supabase
    .from('admin_allowlist')
    .select('id, email, created_at')
    .order('email', { ascending: true });

  return (
    <div className="max-w-2xl">
      <Link href="/studio" className="text-sm text-black/60 hover:underline">
        ← Back to dashboard
      </Link>
      <h2 className="text-3xl font-bold mt-2 mb-2">Admin allowlist</h2>
      <p className="text-black/70 mb-8">
        Only Google accounts on this list can sign in to Studio. Add Cory or other editors here —
        no Supabase dashboard required.
      </p>

      <AllowlistManager initialEntries={entries || []} currentEmail={user?.email || ''} />
    </div>
  );
}
