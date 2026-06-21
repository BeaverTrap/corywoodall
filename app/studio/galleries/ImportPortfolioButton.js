'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { staticPortfolioSections } from '@/lib/content/staticPortfolio';
import { slugify } from '@/lib/content/queries';

export default function ImportPortfolioButton({ show = true }) {
  const router = useRouter();
  const supabase = createClient();
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState('');

  if (!show) return null;

  const importPortfolio = async () => {
    setImporting(true);
    setMessage('');

    for (let seriesIndex = 0; seriesIndex < staticPortfolioSections.length; seriesIndex += 1) {
      const section = staticPortfolioSections[seriesIndex];
      const slug = slugify(section.title);

      const { data: series, error: seriesError } = await supabase
        .from('gallery_series')
        .upsert(
          {
            title: section.title,
            slug,
            description: section.description,
            cover_image_url: section.coverImage,
            sort_order: seriesIndex,
            published: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'slug' }
        )
        .select('id')
        .single();

      if (seriesError) {
        setMessage(seriesError.message);
        setImporting(false);
        return;
      }

      await supabase.from('gallery_images').delete().eq('series_id', series.id);

      const imageRows = section.images.map((image, imageIndex) => ({
        series_id: series.id,
        image_url: image.full,
        thumbnail_url: image.thumbnail,
        alt_text: image.alt,
        sort_order: imageIndex,
      }));

      const { error: imagesError } = await supabase.from('gallery_images').insert(imageRows);
      if (imagesError) {
        setMessage(imagesError.message);
        setImporting(false);
        return;
      }
    }

    setImporting(false);
    setMessage('Imported all existing portfolio galleries. You can edit them below.');
    router.refresh();
  };

  return (
    <div className="mb-8 p-4 rounded-lg border border-amber-200 bg-amber-50">
      <p className="text-sm text-amber-900 mb-3">
        Import the current homepage portfolio into the editor so Cory can reorder images and update series text.
      </p>
      <button
        type="button"
        onClick={importPortfolio}
        disabled={importing}
        className="px-4 py-2 rounded-lg bg-black text-white text-sm disabled:opacity-50"
      >
        {importing ? 'Importing...' : 'Import existing portfolio'}
      </button>
      {message && <p className="text-sm text-black/70 mt-2">{message}</p>}
    </div>
  );
}
