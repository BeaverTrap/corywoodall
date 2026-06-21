'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { importStaticArticles } from '@/lib/content/importArticles';

export default function ImportArticlesButton({ show = true }) {
  const router = useRouter();
  const supabase = createClient();
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState('');

  if (!show) return null;

  const importArticles = async () => {
    setImporting(true);
    setMessage('');

    const result = await importStaticArticles(supabase);

    setImporting(false);
    if (!result.ok) {
      setMessage(result.error);
      return;
    }

    const summary = result.results.map((item) => `${item.slug} (${item.blocks} blocks)`).join(', ');
    setMessage(`Imported ${result.results.length} articles: ${summary}`);
    router.refresh();
  };

  return (
    <div className="mb-8 p-4 rounded-lg border border-amber-200 bg-amber-50">
      <p className="text-sm text-amber-900 mb-3">
        Import the three existing static articles into the CMS so Cory can edit them in Studio. Safe to run
        again — it updates articles by slug.
      </p>
      <button
        type="button"
        onClick={importArticles}
        disabled={importing}
        className="px-4 py-2 rounded-lg bg-black text-white text-sm disabled:opacity-50"
      >
        {importing ? 'Importing...' : 'Import existing articles'}
      </button>
      {message ? <p className="text-sm text-black/70 mt-2">{message}</p> : null}
    </div>
  );
}
