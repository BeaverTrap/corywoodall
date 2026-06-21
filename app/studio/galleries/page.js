import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import ImportPortfolioButton from './ImportPortfolioButton';

export const dynamic = 'force-dynamic';

export default async function GalleriesPage() {
  const supabase = createClient();
  const { data: galleries } = await supabase
    .from('gallery_series')
    .select('id, title, slug, published, sort_order, updated_at')
    .order('sort_order', { ascending: true });

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold">Galleries</h2>
          <p className="text-black/70 mt-1">Portfolio series shown on the homepage.</p>
        </div>
        <Link
          href="/studio/galleries/new"
          className="px-5 py-2.5 rounded-lg bg-black text-white hover:bg-gray-800"
        >
          New gallery
        </Link>
      </div>

      <ImportPortfolioButton />

      <div className="space-y-3">
        {(galleries || []).map((gallery) => (
          <Link
            key={gallery.id}
            href={`/studio/galleries/${gallery.id}`}
            className="block bg-white border border-black/10 rounded-lg p-4 hover:border-black/30 transition-colors"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold">{gallery.title}</p>
                <p className="text-sm text-black/60">/{gallery.slug}</p>
              </div>
              <div className="text-right text-sm">
                <p className={gallery.published ? 'text-green-700' : 'text-amber-700'}>
                  {gallery.published ? 'Published' : 'Draft'}
                </p>
                <p className="text-black/50">Order {gallery.sort_order}</p>
              </div>
            </div>
          </Link>
        ))}
        {!galleries?.length && (
          <p className="text-black/60">No galleries yet. Create your first gallery to replace the static homepage content.</p>
        )}
      </div>
    </div>
  );
}
