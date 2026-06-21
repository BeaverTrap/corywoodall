import { writeFileSync } from 'node:fs';
import { staticArticles } from '../lib/content/staticArticles.js';

function sqlString(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlJson(value) {
  return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`;
}

const statements = [];

for (const article of staticArticles) {
  statements.push(`
INSERT INTO public.articles (title, slug, excerpt, published, published_at, updated_at)
VALUES (
  ${sqlString(article.title)},
  ${sqlString(article.slug)},
  ${sqlString(article.excerpt)},
  true,
  ${sqlString(article.published_at)}::timestamptz,
  now()
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  published = EXCLUDED.published,
  published_at = EXCLUDED.published_at,
  updated_at = now();
`);

  statements.push(`
DELETE FROM public.article_blocks
WHERE article_id = (SELECT id FROM public.articles WHERE slug = ${sqlString(article.slug)});
`);

  article.blocks.forEach((block, index) => {
    statements.push(`
INSERT INTO public.article_blocks (article_id, block_type, content, sort_order)
VALUES (
  (SELECT id FROM public.articles WHERE slug = ${sqlString(article.slug)}),
  ${sqlString(block.block_type)},
  ${sqlJson(block.content)},
  ${index}
);`);
  });
}

const sql = statements.join('\n');
writeFileSync(new URL('./article-import.sql', import.meta.url), sql, 'utf8');
console.log(`Wrote ${statements.length} SQL statements for ${staticArticles.length} articles.`);

