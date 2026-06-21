'use client';

import ArticleContent from '@/app/components/ArticleContent';

export default function ArticlePreview({ article, blocks }) {
  return (
    <div className="bg-white p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-black/50 mb-4">Article page</p>
      <h1 className="text-3xl font-bold mb-3">{article.title || 'Article title'}</h1>
      {article.excerpt ? <p className="text-black/70 mb-6">{article.excerpt}</p> : null}
      <ArticleContent blocks={blocks} />
    </div>
  );
}
