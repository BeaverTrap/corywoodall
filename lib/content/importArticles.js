import { staticArticles } from './staticArticles';

export async function importStaticArticles(supabase) {
  const results = [];

  for (const article of staticArticles) {
    const { data: saved, error: articleError } = await supabase
      .from('articles')
      .upsert(
        {
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          published: true,
          published_at: article.published_at,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'slug' }
      )
      .select('id')
      .single();

    if (articleError) {
      return { ok: false, error: articleError.message, results };
    }

    await supabase.from('article_blocks').delete().eq('article_id', saved.id);

    const blockRows = article.blocks.map((block, index) => ({
      article_id: saved.id,
      block_type: block.block_type,
      content: block.content,
      sort_order: index,
    }));

    const { error: blocksError } = await supabase.from('article_blocks').insert(blockRows);
    if (blocksError) {
      return { ok: false, error: blocksError.message, results };
    }

    results.push({ slug: article.slug, id: saved.id, blocks: blockRows.length });
  }

  return { ok: true, results };
}
