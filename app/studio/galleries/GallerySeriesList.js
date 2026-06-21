'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import SortableList, { DragHandle } from '@/app/studio/components/SortableList';

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

  return (
    <div className="space-y-3">
      {message ? <p className="text-sm text-black/70">{message}</p> : null}
      <p className="text-sm text-black/60">Drag galleries to set homepage order.</p>
      <SortableList
        items={galleries}
        onReorder={persistOrder}
        getItemKey={(gallery) => gallery.id}
        renderItem={(gallery, index, { dragHandleProps }) => (
          <div className="bg-white border border-black/10 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <DragHandle dragHandleProps={dragHandleProps} />
              <Link href={`/studio/galleries/${gallery.id}`} className="min-w-[200px] hover:underline">
                <p className="font-semibold">{gallery.title}</p>
                <p className="text-sm text-black/60">/{gallery.slug}</p>
              </Link>
            </div>
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
            </div>
          </div>
        )}
      />
      {!galleries.length ? (
        <p className="text-black/60">No galleries yet. Create your first gallery to replace the default homepage content.</p>
      ) : null}
    </div>
  );
}
