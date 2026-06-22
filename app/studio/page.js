import Link from 'next/link';

import { createClient } from '@/lib/supabase/server';

import { getRecentEdits } from '@/lib/content/queries';
import { stripHtmlToText } from '@/lib/studio/richTextContent';



export const dynamic = 'force-dynamic';



function formatRelativeTime(isoDate) {

  const date = new Date(isoDate);

  const diffMs = Date.now() - date.getTime();

  const diffMinutes = Math.round(diffMs / 60000);



  if (diffMinutes < 1) return 'just now';

  if (diffMinutes < 60) return `${diffMinutes}m ago`;



  const diffHours = Math.round(diffMinutes / 60);

  if (diffHours < 24) return `${diffHours}h ago`;



  const diffDays = Math.round(diffHours / 24);

  if (diffDays < 7) return `${diffDays}d ago`;



  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

}



export default async function StudioDashboard() {

  const supabase = createClient();



  const [

    { count: galleryCount },

    { count: articleCount },

    { count: publishedGalleryCount },

    { count: publishedArticleCount },

    recentEdits,

  ] = await Promise.all([

    supabase.from('gallery_series').select('*', { count: 'exact', head: true }),

    supabase.from('articles').select('*', { count: 'exact', head: true }),

    supabase.from('gallery_series').select('*', { count: 'exact', head: true }).eq('published', true),

    supabase.from('articles').select('*', { count: 'exact', head: true }).eq('published', true),

    getRecentEdits(supabase, 5),

  ]);



  return (

    <div className="max-w-4xl">

      <h2 className="text-3xl font-bold mb-2">Dashboard</h2>

      <p className="text-black/70 mb-8">

        Manage site text, portfolio galleries, and articles. Edits auto-save and go live on the public site.

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



      {recentEdits.length > 0 ? (

        <section className="bg-white rounded-lg border border-black/10 p-6 mb-10">

          <h3 className="text-lg font-semibold mb-4">Recent edits</h3>

          <ul className="space-y-3">

            {recentEdits.map((item) => (

              <li key={`${item.type}-${item.id}`}>

                <Link

                  href={item.href}

                  className="flex flex-wrap items-center justify-between gap-2 hover:underline"

                >

                  <span>

                    <span className="text-xs uppercase tracking-wide text-black/40 mr-2">

                      {item.type === 'article' ? 'Article' : 'Gallery'}

                    </span>

                    {stripHtmlToText(item.title)}

                  </span>

                  <span className="text-sm text-black/50">{formatRelativeTime(item.updated_at)}</span>

                </Link>

              </li>

            ))}

          </ul>

        </section>

      ) : null}



      <div className="flex flex-wrap gap-4 mb-6">

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



      <div className="flex flex-wrap gap-4 text-sm">

        <Link href="/studio/help" className="text-black/70 hover:underline">

          How to use Studio →

        </Link>

        <Link href="/studio/admins" className="text-black/70 hover:underline">

          Admin allowlist →

        </Link>

      </div>

    </div>

  );

}


