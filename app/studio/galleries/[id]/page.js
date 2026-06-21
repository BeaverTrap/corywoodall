import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import GalleryEditor from '../GalleryEditor';

export const dynamic = 'force-dynamic';

export default async function EditGalleryPage({ params }) {
  const supabase = createClient();
  const { data: series } = await supabase
    .from('gallery_series')
    .select('*')
    .eq('id', params.id)
    .maybeSingle();

  if (!series) notFound();

  const { data: images } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('series_id', params.id)
    .order('sort_order', { ascending: true });

  return <GalleryEditor initialSeries={series} initialImages={images || []} />;
}
