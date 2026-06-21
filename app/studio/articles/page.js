import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function ArticlesPage() {
  const supabase = createClient();
  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, slug, published, published_at, updated_at')
    .order('updated_at', { ascending: false });

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold">Articles</h2>
          <p className="text-black/70 mt-1">Long-form writing and updates for the public articles section.</p>
        </div>
        <Link
          href="/studio/articles/new"
          className="px-5 py-2.5 rounded-lg bg-black text-white hover:bg-gray-800"
        >
          New article
        </Link>
      </div>

      <div className="space-y-3">
        {(articles || []).map((article) => (
          <Link
            key={article.id}
            href={`/studio/articles/${article.id}`}
            className="block bg-white border border-black/10 rounded-lg p-4 hover:border-black/30 transition-colors"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold">{article.title}</p>
                <p className="text-sm text-black/60">/articles/{article.slug}</p>
              </div>
              <p className={`text-sm ${article.published ? 'text-green-700' : 'text-amber-700'}`}>
                {article.published ? 'Published' : 'Draft'}
              </p>
            </div>
          </Link>
        ))}
        {!articles?.length && (
          <p className="text-black/60">No articles in the database yet. Existing static articles remain live until you publish CMS articles.</p>
        )}
      </div>
    </div>
  );
}
