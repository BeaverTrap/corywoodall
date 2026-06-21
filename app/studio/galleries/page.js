import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import ImportPortfolioButton from './ImportPortfolioButton';
import GallerySeriesList from './GallerySeriesList';

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

      <ImportPortfolioButton show={!galleries?.length} />

      <GallerySeriesList initialGalleries={galleries || []} />
    </div>
  );
}
