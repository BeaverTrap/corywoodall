import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function StudioDashboard() {
  const supabase = createClient();

  const [{ count: galleryCount }, { count: articleCount }, { count: publishedGalleryCount }, { count: publishedArticleCount }] =
    await Promise.all([
      supabase.from('gallery_series').select('*', { count: 'exact', head: true }),
      supabase.from('articles').select('*', { count: 'exact', head: true }),
      supabase.from('gallery_series').select('*', { count: 'exact', head: true }).eq('published', true),
      supabase.from('articles').select('*', { count: 'exact', head: true }).eq('published', true),
    ]);

  return (
    <div className="max-w-4xl">
      <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
      <p className="text-black/70 mb-8">
        Manage site text, portfolio galleries, and articles. Changes appear on the public site immediately.
      </p>

      <div className="grid sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-lg border border-black/10 p-6">
          <p className="text-sm text-black/50 mb-1">Homepage sections</p>
          <p className="text-lg font-bold">Hero, About, FAQ</p>
          <p className="text-sm text-black/60 mt-2">Contact & background</p>
        </div>
        <div className="bg-white rounded-lg border border-black/10 p-6">
          <p className="text-sm text-black/50 mb-1">Galleries</p>
          <p className="text-3xl font-bold">{galleryCount ?? 0}</p>
          <p className="text-sm text-black/60 mt-2">{publishedGalleryCount ?? 0} published</p>
        </div>
        <div className="bg-white rounded-lg border border-black/10 p-6">
          <p className="text-sm text-black/50 mb-1">Articles</p>
          <p className="text-3xl font-bold">{articleCount ?? 0}</p>
          <p className="text-sm text-black/60 mt-2">{publishedArticleCount ?? 0} published</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link
          href="/studio/site"
          className="px-5 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors"
        >
          Edit site content
        </Link>
        <Link
          href="/studio/galleries"
          className="px-5 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors"
        >
          Manage galleries
        </Link>
        <Link
          href="/studio/articles"
          className="px-5 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors"
        >
          Manage articles
        </Link>
      </div>
    </div>
  );
}
