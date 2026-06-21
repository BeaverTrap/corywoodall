import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth/verify-admin';
import { createClient } from '@/lib/supabase/server';
import { importStaticArticles } from '@/lib/content/importArticles';

export async function POST() {
  const auth = await verifyAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const supabase = createClient();
  const result = await importStaticArticles(supabase);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ imported: result.results });
}
