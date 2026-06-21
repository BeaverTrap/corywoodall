'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function SiteEditBar() {
  const [visible, setVisible] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    let cancelled = false;

    async function checkAccess() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || cancelled) {
        setVisible(false);
        return;
      }

      const { data: isAdmin } = await supabase.rpc('is_admin');
      if (!cancelled) {
        setVisible(isAdmin === true);
      }
    }

    checkAccess();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-black text-white text-sm shadow-lg border-t border-white/10">
      <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <span className="text-white/70">Signed in</span>
        <Link href="/studio/site" className="hover:underline font-medium">
          Edit site content
        </Link>
        <Link href="/studio/galleries" className="hover:underline">
          Galleries
        </Link>
        <Link href="/studio/articles" className="hover:underline">
          Articles
        </Link>
        <Link href="/studio" className="hover:underline">
          Studio
        </Link>
        <form action="/auth/signout" method="post" className="inline">
          <button type="submit" className="text-white/80 hover:text-white hover:underline">
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
