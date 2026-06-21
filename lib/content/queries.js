import { staticPortfolioSections } from './staticPortfolio';
import { defaultSiteContent } from './staticSite';

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

export async function getPublishedGallerySeries(supabase) {
  const { data: series, error } = await supabase
    .from('gallery_series')
    .select(`
      id,
      title,
      slug,
      description,
      cover_image_url,
      sort_order,
      gallery_images (
        id,
        image_url,
        thumbnail_url,
        alt_text,
        sort_order
      )
    `)
    .eq('published', true)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  if (!series?.length) return null;

  return series.map((item) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    coverImage: item.cover_image_url,
    description: item.description,
    images: (item.gallery_images || [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((img) => ({
        thumbnail: img.thumbnail_url || img.image_url,
        full: img.image_url,
        alt: img.alt_text,
      })),
  }));
}

export async function getPortfolioSections(supabase) {
  if (!isSupabaseConfigured()) {
    return staticPortfolioSections;
  }

  try {
    const fromDb = await getPublishedGallerySeries(supabase);
    if (fromDb?.length) return fromDb;
  } catch (error) {
    console.error('Failed to load galleries from Supabase:', error);
  }

  return staticPortfolioSections;
}

export async function getPublishedArticles(supabase) {
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, slug, excerpt, published_at')
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getAdjacentArticles(supabase, slug) {
  const articles = await getPublishedArticles(supabase);
  const index = articles.findIndex((article) => article.slug === slug);
  if (index === -1) return { previous: null, next: null };

  return {
    previous: articles[index + 1] || null,
    next: articles[index - 1] || null,
  };
}

export async function getArticleBySlug(supabase, slug) {
  const { data: article, error } = await supabase
    .from('articles')
    .select(`
      id,
      title,
      slug,
      excerpt,
      published_at,
      article_blocks (
        id,
        block_type,
        content,
        sort_order
      )
    `)
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  if (error) throw error;
  if (!article) return null;

  return {
    ...article,
    blocks: (article.article_blocks || []).sort(
      (a, b) => a.sort_order - b.sort_order
    ),
  };
}

export async function getRecentEdits(supabase, limit = 5) {
  const [{ data: articles }, { data: galleries }] = await Promise.all([
    supabase
      .from('articles')
      .select('id, title, updated_at')
      .order('updated_at', { ascending: false })
      .limit(limit),
    supabase
      .from('gallery_series')
      .select('id, title, updated_at')
      .order('updated_at', { ascending: false })
      .limit(limit),
  ]);

  const items = [
    ...(articles || []).map((item) => ({
      type: 'article',
      id: item.id,
      title: item.title,
      updated_at: item.updated_at,
      href: `/studio/articles/${item.id}`,
    })),
    ...(galleries || []).map((item) => ({
      type: 'gallery',
      id: item.id,
      title: item.title,
      updated_at: item.updated_at,
      href: `/studio/galleries/${item.id}`,
    })),
  ];

  return items
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, limit);
}

export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function estimateReadingTime(blocks) {
  const words = (blocks || [])
    .filter((b) => b.block_type === 'text' || b.block_type === 'heading')
    .map((b) => {
      if (b.block_type === 'text') return b.content?.body || '';
      if (b.block_type === 'heading') return b.content?.text || '';
      return '';
    })
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.round(words / 200));
}

function mergeSection(defaults, fromDb) {
  if (!fromDb || typeof fromDb !== 'object') return defaults;
  return { ...defaults, ...fromDb };
}

export async function getSiteContent(supabase) {
  const content = structuredClone(defaultSiteContent);

  if (!isSupabaseConfigured()) {
    return content;
  }

  try {
    const { data, error } = await supabase.from('site_sections').select('key, content');
    if (error) throw error;

    for (const row of data || []) {
      if (row.key === 'home') {
        content.home = {
          hero: mergeSection(defaultSiteContent.home.hero, row.content?.hero),
          about: mergeSection(defaultSiteContent.home.about, row.content?.about),
          contact: mergeSection(defaultSiteContent.home.contact, row.content?.contact),
          faq: mergeSection(defaultSiteContent.home.faq, row.content?.faq),
        };
        if (row.content?.faq?.items?.length) {
          content.home.faq.items = row.content.faq.items;
        }
        if (row.content?.about?.paragraphs?.length) {
          content.home.about.paragraphs = row.content.about.paragraphs;
        }
      } else if (row.key === 'articles_index') {
        content.articles_index = mergeSection(defaultSiteContent.articles_index, row.content);
      } else if (row.key === 'site_meta') {
        content.site_meta = mergeSection(defaultSiteContent.site_meta, row.content);
      }
    }
  } catch (error) {
    console.error('Failed to load site content from Supabase:', error);
  }

  return content;
}
