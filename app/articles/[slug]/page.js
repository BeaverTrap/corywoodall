import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FaTwitter, FaFacebook, FaEnvelope } from 'react-icons/fa';
import { createClient } from '@/lib/supabase/server';
import { getArticleBySlug, getAdjacentArticles, estimateReadingTime, isSupabaseConfigured } from '@/lib/content/queries';
import { getArticleOgImage } from '@/lib/content/articleOgImage';
import ArticleContent from '@/app/components/ArticleContent';
import ArticleNavigation from '@/app/components/ArticleNavigation';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  if (!isSupabaseConfigured()) return {};

  const supabase = createClient();
  const article = await getArticleBySlug(supabase, params.slug);
  if (!article) return {};

  const ogImage = getArticleOgImage(article.blocks);

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `https://corywoodall.com/articles/${article.slug}`,
      type: 'article',
      ...(ogImage ? { images: [{ url: ogImage, alt: article.title }] } : {}),
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title: article.title,
      description: article.excerpt,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function CmsArticlePage({ params }) {
  if (!isSupabaseConfigured()) notFound();

  const supabase = createClient();
  const article = await getArticleBySlug(supabase, params.slug);
  if (!article) notFound();

  const readingTime = estimateReadingTime(article.blocks);
  const { previous, next } = await getAdjacentArticles(supabase, params.slug);
  const pageUrl = `https://corywoodall.com/articles/${article.slug}`;
  const shareText = encodeURIComponent(article.title);

  return (
    <div className="py-8">
      <div className="mb-2">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-0 text-left leading-tight">
            {article.title}
          </h1>
          <div className="text-sm text-black/60 text-right">
            <span>
              {article.published_at
                ? new Date(article.published_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : ''}
            </span>
            <span className="mx-2">·</span>
            <span>{readingTime} min read</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-8">
        <div className="flex gap-2">
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/80 shadow hover:bg-black/90 hover:text-white transition-colors text-black/70 text-lg"
            title="Share on Twitter"
          >
            <FaTwitter />
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/80 shadow hover:bg-black/90 hover:text-white transition-colors text-black/70 text-lg"
            title="Share on Facebook"
          >
            <FaFacebook />
          </a>
          <a
            href={`mailto:?subject=${shareText}&body=${encodeURIComponent(pageUrl)}`}
            className="text-lg flex items-center justify-center w-9 h-9 rounded-full bg-white/80 shadow hover:bg-black/90 hover:text-white transition-colors text-black/70"
            title="Share via Email"
          >
            <FaEnvelope />
          </a>
        </div>
      </div>

      <ArticleContent blocks={article.blocks} />

      <ArticleNavigation previous={previous} next={next} />

      <div className="mt-8 pt-8 border-t border-black/10">
        <Link href="/articles" className="text-black/70 hover:text-black hover:underline">
          ← Back to articles
        </Link>
      </div>
    </div>
  );
}
