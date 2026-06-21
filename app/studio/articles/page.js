import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import ImportArticlesButton from './ImportArticlesButton';

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

      <ImportArticlesButton show={!articles?.length} />

      <div className="space-y-3">
        {(articles || []).map((article) => (
          <div
            key={article.id}
            className="bg-white border border-black/10 rounded-lg p-4 hover:border-black/30 transition-colors"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link href={`/studio/articles/${article.id}`} className="flex-1 min-w-[200px] hover:underline">
                <p className="font-semibold">{article.title}</p>
                <p className="text-sm text-black/60">/articles/{article.slug}</p>
              </Link>
              <div className="flex flex-wrap items-center gap-3">
                <p className={`text-sm ${article.published ? 'text-green-700' : 'text-amber-700'}`}>
                  {article.published ? 'Published' : 'Draft'}
                </p>
                {article.published ? (
                  <Link
                    href={`/articles/${article.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm px-3 py-1 border border-black/20 rounded hover:bg-black/5"
                  >
                    View on site
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        ))}
        {!articles?.length && (
          <p className="text-black/60">
            No articles yet. Use Import existing articles to load the original site content, or create a new article.
          </p>
        )}
      </div>
    </div>
  );
}
