import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getPublishedArticles, estimateReadingTime, isSupabaseConfigured, getSiteContent } from '@/lib/content/queries';

const articlesDirectory = path.join(process.cwd(), 'app/articles');

function getStaticArticles() {
  const entries = fs.readdirSync(articlesDirectory, { withFileTypes: true });
  const articleDirs = entries.filter(
    (entry) => entry.isDirectory() && !['[slug]'].includes(entry.name)
  );

  return articleDirs
    .map((dir) => {
      const mdxPath = path.join(articlesDirectory, dir.name, 'page.mdx');
      const jsPath = path.join(articlesDirectory, dir.name, 'page.js');

      if (fs.existsSync(mdxPath)) {
        const fileContents = fs.readFileSync(mdxPath, 'utf8');
        const { data, content } = matter(fileContents);
        const words = content ? content.split(/\s+/).length : 0;
        const readingTime = Math.max(1, Math.round(words / 200));
        const preview = content ? `${content.split(/\s+/).slice(0, 40).join(' ')}…` : '';
        return {
          slug: dir.name,
          title: data.title,
          date: data.date,
          readingTime,
          preview,
        };
      }

      if (fs.existsSync(jsPath)) {
        if (dir.name === 'what-is-a-cyanotype') {
          return {
            slug: dir.name,
            title: 'What is a Cyanotype?',
            date: '2025-07-12',
            readingTime: 4,
            preview:
              'The medium of cyanotype is a photographic one, created with a careful mixture of light sensitive chemicals coated onto a support surface and exposed to ultraviolet light, leaving behind areas of light and dark—shadows, essentially. This shadow-fixing process is the basis of all non-digital photography since its invention in 1839.…',
          };
        }
        if (dir.name === 'arizona-state-parks-artist-residency-2025') {
          return {
            slug: dir.name,
            title: 'Cory Woodall Selected for Arizona State Parks Artist Residency',
            date: '2025-10-24',
            readingTime: 4,
            preview:
              'Flagstaff-based artist Cory Woodall has been selected for the Arizona State Parks Artist Residency Program, hosted at Patagonia Lake State Park and presented in collaboration with Arizona State Parks and Trails and the Arizona Commission on the Arts. During the three-week residency, Cory will continue her exploration of the historic cyanotype process.…',
          };
        }
        if (dir.name === 'patagonia-lake-residency') {
          return {
            slug: dir.name,
            title: 'Artist in Residence: Patagonia Lake State Park',
            date: '2025-11-14',
            readingTime: 5,
            preview:
              "Cory Woodall is currently spending three weeks at Patagonia Lake State Park as part of the Artist-in-Residence program supported by Arizona State Parks & Trails and the Arizona Commission on the Arts. The residency gives her uninterrupted time to continue her ongoing cyanotype research, working directly with plant material found in one of Arizona's most biologically mixed environments.…",
          };
        }
      }

      return null;
    })
    .filter(Boolean);
}

export const dynamic = 'force-dynamic';

export default async function ArticlesIndex() {
  let articles = getStaticArticles();
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
