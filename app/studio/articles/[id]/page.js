import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ArticleEditor from '../ArticleEditor';

export const dynamic = 'force-dynamic';

export default async function EditArticlePage({ params }) {
  const supabase = createClient();
  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('id', params.id)
    .maybeSingle();

  if (!article) notFound();

  const { data: blocks } = await supabase
    .from('article_blocks')
    .select('*')
    .eq('article_id', params.id)
    .order('sort_order', { ascending: true });

  return <ArticleEditor initialArticle={article} initialBlocks={blocks || []} />;
}
