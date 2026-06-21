'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function GallerySeriesList({ initialGalleries }) {
  const router = useRouter();
  const supabase = createClient();
  const [galleries, setGalleries] = useState(initialGalleries);
  const [message, setMessage] = useState('');

  const persistOrder = async (nextGalleries) => {
    setGalleries(nextGalleries);
    const updates = nextGalleries.map((gallery, index) =>
      supabase
        .from('gallery_series')
        .update({ sort_order: index, updated_at: new Date().toISOString() })
        .eq('id', gallery.id)
    );
    const results = await Promise.all(updates);
    const error = results.find((result) => result.error)?.error;
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage('Homepage gallery order updated.');
    router.refresh();
  };

  const moveGallery = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= galleries.length) return;
    const next = [...galleries];
    [next[index], next[target]] = [next[target], next[index]];
    persistOrder(next);
  };

  return (
    <div className="space-y-3">
      {message ? <p className="text-sm text-black/70">{message}</p> : null}
      {galleries.map((gallery, index) => (
        <div
          key={gallery.id}
          className="bg-white border border-black/10 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4"
        >
          <Link href={`/studio/galleries/${gallery.id}`} className="flex-1 min-w-[200px] hover:underline">
            <p className="font-semibold">{gallery.title}</p>
            <p className="text-sm text-black/60">/{gallery.slug}</p>
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <p className={`text-sm ${gallery.published ? 'text-green-700' : 'text-amber-700'}`}>
              {gallery.published ? 'Published' : 'Draft'}
            </p>
            {gallery.published ? (
              <Link
                href="/#portfolio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm px-3 py-1 border border-black/20 rounded hover:bg-black/5"
              >
                View on site
              </Link>
            ) : null}
            <p className="text-sm text-black/50">Homepage #{index + 1}</p>
            <button
              type="button"
              className="text-sm px-2 py-1 border rounded disabled:opacity-40"
              disabled={index === 0}
              onClick={() => moveGallery(index, -1)}
            >
              Move up
            </button>
            <button
              type="button"
              className="text-sm px-2 py-1 border rounded disabled:opacity-40"
              disabled={index === galleries.length - 1}
              onClick={() => moveGallery(index, 1)}
            >
              Move down
            </button>
          </div>
        </div>
      ))}
      {!galleries.length ? (
        <p className="text-black/60">No galleries yet. Create your first gallery to replace the default homepage content.</p>
      ) : null}
    </div>
  );
}
