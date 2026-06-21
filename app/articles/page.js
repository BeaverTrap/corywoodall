import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getPublishedArticles, estimateReadingTime, isSupabaseConfigured, getSiteContent } from '@/lib/content/queries';
import { getStaticArticleSummaries } from '@/lib/content/staticArticles';

export const dynamic = 'force-dynamic';

export default async function ArticlesIndex() {
  let articles = getStaticArticleSummaries().map((article) => ({
    ...article,
    readingTime: Math.max(1, Math.round(article.preview.split(/\s+/).length / 200)),
  }));
  let articlesIndex = {
    title: 'ARTICLES',
    subtitle: 'Insights into cyanotype art, historical processes, and contemporary applications',
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const siteContent = await getSiteContent(supabase);
      articlesIndex = siteContent.articles_index;

      const cmsArticles = await getPublishedArticles(supabase);
      const cmsMapped = await Promise.all(
        cmsArticles.map(async (article) => {
          const full = await supabase
            .from('article_blocks')
            .select('block_type, content')
            .eq('article_id', article.id)
            .order('sort_order', { ascending: true });

          return {
            slug: article.slug,
            title: article.title,
            date: article.published_at?.slice(0, 10) || '',
            readingTime: estimateReadingTime(full.data || []),
            preview: article.excerpt,
          };
        })
      );

      const cmsSlugs = new Set(cmsMapped.map((article) => article.slug));
      articles = [
        ...cmsMapped,
        ...articles.filter((article) => !cmsSlugs.has(article.slug)),
      ];
    } catch (error) {
      console.error('Failed to load CMS articles:', error);
    }
  }

  articles.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <>
      <div className="text-center mb-8 md:mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-black mb-4 md:mb-8 tracking-[0.1em]">
          {articlesIndex.title}
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-black/80 tracking-wide max-w-2xl mx-auto px-4">
          {articlesIndex.subtitle}
        </p>
      </div>
      <div className="space-y-6 md:space-y-8">
        {articles.map((article) => (
          <div key={article.slug} className="backdrop-blur-md bg-white/50 p-4 sm:p-6 md:p-8 rounded-lg">
            <div className="mb-4">
              <Link
                href={`/articles/${article.slug}`}
                className="text-xl sm:text-2xl md:text-3xl font-bold text-black tracking-wide hover:underline block mb-2"
              >
                {article.title}
              </Link>
              <div className="text-xs sm:text-sm text-black/60 flex flex-wrap items-center gap-2">
                <span>{article.date}</span>
                <span>·</span>
                <span>{article.readingTime} min read</span>
              </div>
            </div>
            <p className="text-sm sm:text-base md:text-lg text-black/80 leading-relaxed tracking-wide mb-4">
              {article.preview}
            </p>
            <div>
              <Link
                href={`/articles/${article.slug}`}
                className="text-sm sm:text-base text-black font-medium hover:underline"
              >
                Read more →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
