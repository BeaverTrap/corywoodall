'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/content/queries';
import { uploadStudioImage } from '@/lib/uploads/client';

const BLOCK_TYPES = [
  { value: 'heading', label: 'Heading' },
  { value: 'text', label: 'Text' },
  { value: 'image', label: 'Single image' },
  { value: 'image_grid', label: 'Image grid' },
];

const emptyArticle = {
  title: '',
  slug: '',
  excerpt: '',
  published: false,
  published_at: null,
};

function defaultContent(type) {
  switch (type) {
    case 'heading':
      return { text: '', level: 2 };
    case 'text':
      return { body: '' };
    case 'image':
      return { src: '', alt: '', caption: '' };
    case 'image_grid':
      return { cols: 3, caption: '', images: [{ src: '', alt: '' }] };
    default:
      return {};
  }
}

export default function ArticleEditor({ initialArticle = null, initialBlocks = [] }) {
  const router = useRouter();
  const supabase = createClient();
  const isNew = !initialArticle?.id;

  const [article, setArticle] = useState(initialArticle || emptyArticle);
  const [blocks, setBlocks] = useState(initialBlocks);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const updateArticle = (field, value) => {
    setArticle((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'title' && (isNew || !prev.slug)) {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  const addBlock = (type) => {
    setBlocks((prev) => [
      ...prev,
      {
        block_type: type,
        content: defaultContent(type),
        sort_order: prev.length,
      },
    ]);
  };

  const updateBlock = (index, content) => {
    setBlocks((prev) => prev.map((block, i) => (i === index ? { ...block, content } : block)));
  };

  const moveBlock = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    setBlocks(next);
  };

  const removeBlock = async (index) => {
    const block = blocks[index];
    if (block.id) {
      await supabase.from('article_blocks').delete().eq('id', block.id);
    }
    setBlocks((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadForBlock = async (index, file, imageIndex = null) => {
    let publicUrl;
    try {
      publicUrl = await uploadStudioImage(file, 'articles');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Image upload failed.');
      return;
    }

    const block = blocks[index];
    if (block.block_type === 'image') {
      updateBlock(index, {
        ...block.content,
        src: publicUrl,
        alt: block.content.alt || file.name.replace(/\.[^.]+$/, ''),
      });
      return;
    }

    if (block.block_type === 'image_grid') {
      const images = [...(block.content.images || [])];
      const alt = file.name.replace(/\.[^.]+$/, '');
      if (imageIndex === null) {
        images.push({ src: publicUrl, alt });
      } else {
        images[imageIndex] = { ...images[imageIndex], src: publicUrl, alt: images[imageIndex]?.alt || alt };
      }
      updateBlock(index, { ...block.content, images });
    }
  };

  const saveArticle = async () => {
    setSaving(true);
    setMessage('');

    const publishedAt = article.published
      ? article.published_at || new Date().toISOString()
      : null;

    const payload = {
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      published: Boolean(article.published),
      published_at: publishedAt,
      updated_at: new Date().toISOString(),
    };

    let articleId = article.id;

    if (isNew) {
      const { data, error } = await supabase.from('articles').insert(payload).select('id').single();
      if (error) {
        setMessage(error.message);
        setSaving(false);
        return;
      }
      articleId = data.id;
    } else {
      const { error } = await supabase.from('articles').update(payload).eq('id', article.id);
      if (error) {
        setMessage(error.message);
        setSaving(false);
        return;
      }
    }

    for (let index = 0; index < blocks.length; index += 1) {
      const block = blocks[index];
      const blockPayload = {
        article_id: articleId,
        block_type: block.block_type,
        content: block.content,
        sort_order: index,
      };

      if (block.id) {
        const { error } = await supabase.from('article_blocks').update(blockPayload).eq('id', block.id);
        if (error) {
          setMessage(error.message);
          setSaving(false);
          return;
        }
      } else {
        const { error } = await supabase.from('article_blocks').insert(blockPayload);
        if (error) {
          setMessage(error.message);
          setSaving(false);
          return;
        }
      }
    }

    setSaving(false);
    setMessage('Saved.');
    router.push(`/studio/articles/${articleId}`);
    router.refresh();
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link href="/studio/articles" className="text-sm text-black/60 hover:underline">
            ← Back to articles
          </Link>
          <h2 className="text-3xl font-bold mt-2">{isNew ? 'New article' : 'Edit article'}</h2>
        </div>
        <button
          type="button"
          onClick={saveArticle}
          disabled={saving || !article.title}
          className="px-5 py-2.5 rounded-lg bg-black text-white disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save article'}
        </button>
      </div>

      {message && <p className="text-sm text-black/70">{message}</p>}

      <section className="bg-white border border-black/10 rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            className="w-full border border-black/20 rounded px-3 py-2"
            value={article.title}
            onChange={(e) => updateArticle('title', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">URL slug</label>
          <input
            className="w-full border border-black/20 rounded px-3 py-2"
            value={article.slug}
            onChange={(e) => updateArticle('slug', slugify(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Excerpt</label>
          <textarea
            rows={3}
            className="w-full border border-black/20 rounded px-3 py-2"
            value={article.excerpt}
            onChange={(e) => updateArticle('excerpt', e.target.value)}
          />
        </div>
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(article.published)}
            onChange={(e) => updateArticle('published', e.target.checked)}
          />
          Published
        </label>
      </section>

      <section className="bg-white border border-black/10 rounded-lg p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-semibold">Content blocks</h3>
          <div className="flex flex-wrap gap-2">
            {BLOCK_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                className="px-3 py-1.5 border border-black/20 rounded hover:bg-black/5 text-sm"
                onClick={() => addBlock(type.value)}
              >
                + {type.label}
              </button>
            ))}
          </div>
        </div>

        {blocks.map((block, index) => (
          <div key={block.id || `block-${index}`} className="border border-black/10 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium capitalize">{block.block_type.replace('_', ' ')}</p>
              <div className="flex gap-2">
                <button type="button" className="px-2 py-1 border rounded text-sm" onClick={() => moveBlock(index, -1)}>
                  Up
                </button>
                <button type="button" className="px-2 py-1 border rounded text-sm" onClick={() => moveBlock(index, 1)}>
                  Down
                </button>
                <button type="button" className="px-2 py-1 border rounded text-sm text-red-700" onClick={() => removeBlock(index)}>
                  Remove
                </button>
              </div>
            </div>

            {block.block_type === 'heading' && (
              <>
                <input
                  className="w-full border border-black/20 rounded px-3 py-2"
                  value={block.content.text || ''}
                  onChange={(e) => updateBlock(index, { ...block.content, text: e.target.value })}
                  placeholder="Heading text"
                />
                <select
                  className="border border-black/20 rounded px-3 py-2"
                  value={block.content.level || 2}
                  onChange={(e) => updateBlock(index, { ...block.content, level: Number(e.target.value) })}
                >
                  <option value={2}>H2</option>
                  <option value={3}>H3</option>
                </select>
              </>
            )}

            {block.block_type === 'text' && (
              <textarea
                rows={6}
                className="w-full border border-black/20 rounded px-3 py-2"
                value={block.content.body || ''}
                onChange={(e) => updateBlock(index, { ...block.content, body: e.target.value })}
              />
            )}

            {block.block_type === 'image' && (
              <div className="space-y-3">
                {block.content.src && (
                  <img src={block.content.src} alt={block.content.alt || ''} className="max-h-48 rounded" />
                )}
                <label className="inline-block px-3 py-2 border rounded cursor-pointer">
                  Upload image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && uploadForBlock(index, e.target.files[0])}
                  />
                </label>
                <input
                  className="w-full border border-black/20 rounded px-3 py-2"
                  value={block.content.alt || ''}
                  onChange={(e) => updateBlock(index, { ...block.content, alt: e.target.value })}
                  placeholder="Alt text / caption"
                />
                <input
                  className="w-full border border-black/20 rounded px-3 py-2"
                  value={block.content.caption || ''}
                  onChange={(e) => updateBlock(index, { ...block.content, caption: e.target.value })}
                  placeholder="Optional figure caption"
                />
              </div>
            )}

            {block.block_type === 'image_grid' && (
              <div className="space-y-3">
                <select
                  className="border border-black/20 rounded px-3 py-2"
                  value={block.content.cols || 3}
                  onChange={(e) => updateBlock(index, { ...block.content, cols: Number(e.target.value) })}
                >
                  <option value={2}>2 columns</option>
                  <option value={3}>3 columns</option>
                  <option value={4}>4 columns</option>
                </select>
                {(block.content.images || []).map((image, imageIndex) => (
                  <div key={`${image.src}-${imageIndex}`} className="border border-black/10 rounded p-3 space-y-2">
                    {image.src && <img src={image.src} alt={image.alt || ''} className="max-h-32 rounded" />}
                    <label className="inline-block px-3 py-2 border rounded cursor-pointer text-sm">
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          e.target.files?.[0] && uploadForBlock(index, e.target.files[0], imageIndex)
                        }
                      />
                    </label>
                    <input
                      className="w-full border border-black/20 rounded px-3 py-2"
                      value={image.alt || ''}
                      onChange={(e) => {
                        const images = [...block.content.images];
                        images[imageIndex] = { ...images[imageIndex], alt: e.target.value };
                        updateBlock(index, { ...block.content, images });
                      }}
                      placeholder="Alt text"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="px-3 py-1 border rounded text-sm"
                  onClick={() =>
                    updateBlock(index, {
                      ...block.content,
                      images: [...(block.content.images || []), { src: '', alt: '' }],
                    })
                  }
                >
                  Add image slot
                </button>
                <input
                  className="w-full border border-black/20 rounded px-3 py-2"
                  value={block.content.caption || ''}
                  onChange={(e) => updateBlock(index, { ...block.content, caption: e.target.value })}
                  placeholder="Grid caption"
                />
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
