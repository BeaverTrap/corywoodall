'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/content/queries';
import { uploadStudioImage } from '@/lib/uploads/client';
import ImageUploadButton from '@/app/studio/components/ImageUploadButton';
import RichTextarea from '@/app/studio/components/RichTextarea';
import StudioEditorShell from '@/app/studio/components/StudioEditorShell';
import EditorPreviewRow from '@/app/studio/components/EditorPreviewRow';
import SortableList from '@/app/studio/components/SortableList';
import ReorderControls from '@/app/studio/components/ReorderControls';
import StudioSaveBar from '@/app/studio/components/StudioSaveBar';
import PublishedToggle from '@/app/studio/components/PublishedToggle';
import DeleteConfirmButton from '@/app/studio/components/DeleteConfirmButton';
import { useUnsavedChanges } from '@/app/studio/hooks/useUnsavedChanges';
import { useStudioAutoSave } from '@/app/studio/hooks/useStudioAutoSave';
import ArticleBlockPreview, { ArticleHeaderPreview } from '@/app/studio/components/ArticleBlockPreview';

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
  meta_title: '',
  meta_description: '',
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
  const [article, setArticle] = useState(initialArticle || emptyArticle);
  const [blocks, setBlocks] = useState(initialBlocks);
  const isNew = !article.id;
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageTone, setMessageTone] = useState('info');
  const [savedSnapshot, setSavedSnapshot] = useState('');

  const currentSnapshot = useMemo(() => JSON.stringify({ article, blocks }), [article, blocks]);
  const isDirty = Boolean(savedSnapshot) && currentSnapshot !== savedSnapshot;
  useUnsavedChanges(isDirty);

  useEffect(() => {
    setSavedSnapshot(JSON.stringify({ article: initialArticle || emptyArticle, blocks: initialBlocks }));
  }, [initialArticle, initialBlocks]);

  const viewHref = article.published && article.slug ? `/articles/${article.slug}` : null;

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

  const removeBlock = async (index) => {
    const block = blocks[index];
    if (block.id) {
      await supabase.from('article_blocks').delete().eq('id', block.id);
    }
    setBlocks((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadForBlock = async (index, file, imageIndex = null) => {
    setUploading(true);
    setMessage('Uploading image...');

    let publicUrl;
    try {
      publicUrl = await uploadStudioImage(file, 'articles', 'article');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Image upload failed.');
      setMessageTone('error');
      setUploading(false);
      return;
    } finally {
      setUploading(false);
    }

    setMessage('Image uploaded. Changes auto-save after a short pause.');
    setMessageTone('info');

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

  const saveArticle = async ({ auto = false } = {}) => {
    if (!article.title?.trim()) return;

    setSaving(true);
    if (!auto) setMessage('');

    const publishedAt = article.published
      ? article.published_at || new Date().toISOString()
      : null;

    const payload = {
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      meta_title: article.meta_title?.trim() || null,
      meta_description: article.meta_description?.trim() || null,
      published: Boolean(article.published),
      published_at: publishedAt,
      updated_at: new Date().toISOString(),
    };

    let articleId = article.id;

    if (isNew) {
      const { data, error } = await supabase.from('articles').insert(payload).select('id').single();
      if (error) {
        setMessage(error.message);
        setMessageTone('error');
        setSaving(false);
        return;
      }
      articleId = data.id;
      setArticle((prev) => ({ ...prev, id: data.id }));
    } else {
      const { error } = await supabase.from('articles').update(payload).eq('id', article.id);
      if (error) {
        setMessage(error.message);
        setMessageTone('error');
        setSaving(false);
        return;
      }
    }

    const nextBlocks = [...blocks];

    for (let index = 0; index < nextBlocks.length; index += 1) {
      const block = nextBlocks[index];
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
          setMessageTone('error');
          setSaving(false);
          return;
        }
      } else {
        const { data, error } = await supabase
          .from('article_blocks')
          .insert(blockPayload)
          .select('id')
          .single();
        if (error) {
          setMessage(error.message);
          setMessageTone('error');
          setSaving(false);
          return;
        }
        nextBlocks[index] = { ...block, id: data.id };
      }
    }

    setBlocks(nextBlocks);
    setArticle((prev) => ({ ...prev, id: articleId }));

    setSaving(false);
    setMessage(
      auto
        ? 'Auto-saved — article updates are live when published.'
        : 'Saved — article updates are live when published.'
    );
    setMessageTone('success');
    setSavedSnapshot(JSON.stringify({ article: { ...article, id: articleId }, blocks: nextBlocks }));

    if (!auto) {
      router.push(`/studio/articles/${articleId}`);
      router.refresh();
    }
  };

  useStudioAutoSave({
    enabled: Boolean(article.title?.trim()) && !saving && !uploading,
    isDirty,
    onAutoSave: () => saveArticle({ auto: true }),
  });

  const duplicateArticle = async () => {
    if (isNew || !article.id) return;

    if (!window.confirm(`Create a draft copy of "${article.title}"?`)) return;

    setSaving(true);
    setMessage('');

    const copySlug = slugify(`${article.slug}-copy-${Date.now().toString(36)}`);
    const { data: copy, error: articleError } = await supabase
      .from('articles')
      .insert({
        title: `${article.title} (copy)`,
        slug: copySlug,
        excerpt: article.excerpt,
        meta_title: article.meta_title,
        meta_description: article.meta_description,
        published: false,
        published_at: null,
        updated_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (articleError) {
      setMessage(articleError.message);
      setMessageTone('error');
      setSaving(false);
      return;
    }

    const blockRows = blocks.map((block, index) => ({
      article_id: copy.id,
      block_type: block.block_type,
      content: block.content,
      sort_order: index,
    }));

    if (blockRows.length) {
      const { error: blocksError } = await supabase.from('article_blocks').insert(blockRows);
      if (blocksError) {
        await supabase.from('articles').delete().eq('id', copy.id);
        setMessage(blocksError.message);
        setMessageTone('error');
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    router.push(`/studio/articles/${copy.id}`);
    router.refresh();
  };

  const deleteArticle = async () => {
    if (!article.id) return;

    const { error } = await supabase.from('articles').delete().eq('id', article.id);
    if (error) {
      setMessage(error.message);
      setMessageTone('error');
      return;
    }

    router.push('/studio/articles');
    router.refresh();
  };

  const renderBlockEditor = (block, index) => {
    switch (block.block_type) {
      case 'heading':
        return (
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
        );
      case 'text':
        return (
          <RichTextarea
            rows={6}
            value={block.content.body || ''}
            onChange={(body) => updateBlock(index, { ...block.content, body })}
          />
        );
      case 'image':
        return (
          <div className="space-y-3">
            {block.content.src ? (
              <img src={block.content.src} alt={block.content.alt || ''} className="max-h-48 rounded" />
            ) : null}
            <ImageUploadButton
              label={uploading ? 'Uploading...' : 'Upload image'}
              onChange={(e) => e.target.files?.[0] && uploadForBlock(index, e.target.files[0])}
              disabled={uploading}
            />
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
        );
      case 'image_grid':
        return (
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
                {image.src ? <img src={image.src} alt={image.alt || ''} className="max-h-32 rounded" /> : null}
                <ImageUploadButton
                  label={uploading ? 'Uploading...' : 'Upload image'}
                  onChange={(e) =>
                    e.target.files?.[0] && uploadForBlock(index, e.target.files[0], imageIndex)
                  }
                  disabled={uploading}
                />
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
        );
      default:
        return null;
    }
  };

  return (
    <>
    <StudioEditorShell
      header={
        <>
          <div>
            <Link href="/studio/articles" className="text-sm text-black/60 hover:underline">
              ← Back to articles
            </Link>
            <h2 className="text-3xl font-bold mt-2">{isNew ? 'New article' : 'Edit article'}</h2>
            {isDirty ? <p className="text-sm text-amber-700 mt-2">Unsaved changes</p> : null}
          </div>
        </>
      }
    >
      <EditorPreviewRow
        label="Article header preview"
        preview={<ArticleHeaderPreview article={article} />}
        editor={
          <section className="bg-white border border-black/10 rounded-lg p-6 space-y-4 h-full">
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
            <div className="border-t border-black/10 pt-4 space-y-4">
              <h4 className="text-sm font-semibold">SEO (optional)</h4>
              <div>
                <label className="block text-sm font-medium mb-1">Meta title</label>
                <input
                  className="w-full border border-black/20 rounded px-3 py-2"
                  value={article.meta_title || ''}
                  onChange={(e) => updateArticle('meta_title', e.target.value)}
                  placeholder={article.title || 'Defaults to article title'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Meta description</label>
                <textarea
                  rows={2}
                  className="w-full border border-black/20 rounded px-3 py-2"
                  value={article.meta_description || ''}
                  onChange={(e) => updateArticle('meta_description', e.target.value)}
                  placeholder={article.excerpt || 'Defaults to excerpt'}
                />
              </div>
            </div>
            <PublishedToggle
              published={article.published}
              onChange={(value) => updateArticle('published', value)}
              checkboxLabel="Published"
              draftNote="This article is hidden. Visitors cannot open it at /articles/your-slug."
              liveNote="This article is public at /articles/your-slug."
            />
          </section>
        }
      />

      <div className="bg-white border border-black/10 rounded-lg p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold">Content blocks</h3>
            <p className="text-sm text-black/60 mt-1">
              Drag blocks to reorder. Add a <strong>Single image</strong> or <strong>Image grid</strong> block, then use Upload image inside it.
            </p>
          </div>
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

        {blocks.length === 0 ? (
          <p className="text-sm text-black/60 border border-dashed border-black/20 rounded-lg p-4">
            No content yet. Use the buttons above to add text, headings, or image blocks.
          </p>
        ) : null}
      </div>

      <SortableList
        items={blocks}
        onReorder={setBlocks}
        getItemKey={(block, index) => block.id || `block-${index}`}
        className="space-y-6"
        renderItem={(block, index, { dragHandleProps }) => (
          <EditorPreviewRow
            label={`${block.block_type.replace('_', ' ')} preview`}
            preview={<ArticleBlockPreview block={block} />}
            editor={
              <div className="border border-black/10 rounded-lg p-4 space-y-3 h-full bg-white">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium capitalize">{block.block_type.replace('_', ' ')}</p>
                  <ReorderControls
                    dragHandleProps={dragHandleProps}
                    onRemove={() => removeBlock(index)}
                  />
                </div>
                {renderBlockEditor(block, index)}
              </div>
            }
          />
        )}
      />

      {!isNew ? (
        <section className="bg-white border border-black/10 rounded-lg p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Duplicate article</h3>
            <p className="text-sm text-black/70 mb-4">
              Start a new draft with the same content blocks — useful for a new residency post.
            </p>
            <button
              type="button"
              onClick={duplicateArticle}
              disabled={saving}
              className="px-4 py-2 rounded-lg border border-black/20 text-sm font-medium hover:bg-black/5 disabled:opacity-50"
            >
              Duplicate as draft
            </button>
          </div>

          <div className="border-t border-red-200 pt-6">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Delete article</h3>
            <p className="text-sm text-black/70 mb-4">
              Permanently remove &ldquo;{article.title}&rdquo; and all of its content blocks.
            </p>
            <DeleteConfirmButton
              label="Delete article"
              confirmMessage={`Delete "${article.title}"? This cannot be undone.`}
              onConfirm={deleteArticle}
              disabled={saving}
            />
          </div>
        </section>
      ) : null}
    </StudioEditorShell>
    <StudioSaveBar
      saveLabel="Save article"
      onSave={saveArticle}
      saving={saving}
      disabled={!article.title}
      viewHref={viewHref}
      viewLabel="View on site"
      message={message}
      messageTone={messageTone}
    />
    </>
  );
}
