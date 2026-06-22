'use client';

import Image from 'next/image';
import ImageUploadButton from '@/app/studio/components/ImageUploadButton';
import RichTextarea from '@/app/studio/components/RichTextarea';
import ImageGridWithCaptions from '@/app/components/ImageGridWithCaptions';
import ImageWithCaption from '@/app/components/ImageWithCaption';
import PublishedToggle from '@/app/studio/components/PublishedToggle';
import StudioMetaFields, { StudioMetaInput } from '@/app/studio/components/StudioMetaFields';
import { slugify } from '@/lib/content/queries';
import { stripHtmlToText } from '@/lib/studio/richTextContent';

export function ArticleHeaderEditable({ article, onChange, isNew }) {
  const update = (field, value) => {
    const next = { ...article, [field]: value };
    if (field === 'title' && (isNew || !article.slug)) {
      next.slug = slugify(stripHtmlToText(value));
    }
    onChange(next);
  };

  return (
    <div className="bg-white">
      <div className="p-6 sm:p-8 space-y-4">
        <RichTextarea
          rows={1}
          variant="article-title"
          toolbar="minimal"
          singleLine
          bordered={false}
          value={article.title}
          onChange={(value) => update('title', value)}
          placeholder="Article title"
        />
        <RichTextarea
          rows={3}
          variant="article-excerpt"
          toolbar="inline"
          bordered={false}
          value={article.excerpt}
          onChange={(value) => update('excerpt', value)}
          placeholder="Short excerpt for the articles list"
        />
      </div>
      <StudioMetaFields>
        <StudioMetaInput
          label="URL slug"
          value={article.slug}
          onChange={(value) => update('slug', slugify(value))}
          hint="/articles/your-slug"
        />
        <StudioMetaInput
          label="Meta title (optional)"
          value={article.meta_title || ''}
          onChange={(value) => update('meta_title', value)}
          placeholder="Defaults to article title"
        />
        <div>
          <label className="block text-xs font-medium text-black/60 mb-1">Meta description (optional)</label>
          <RichTextarea
            rows={2}
            variant="compact"
            toolbar="inline"
            bordered
            value={article.meta_description || ''}
            onChange={(value) => update('meta_description', value)}
            placeholder="Defaults to excerpt"
          />
        </div>
        <PublishedToggle
          published={article.published}
          onChange={(value) => update('published', value)}
          checkboxLabel="Published"
          draftNote="This article is hidden. Visitors cannot open it at /articles/your-slug."
          liveNote="This article is public at /articles/your-slug."
        />
      </StudioMetaFields>
    </div>
  );
}

export function ArticleBlockEditable({
  block,
  index,
  uploading,
  onUpdate,
  onUpload,
  renderControls,
}) {
  switch (block.block_type) {
    case 'heading': {
      const level = block.content?.level === 3 ? 3 : 2;
      return (
        <div className="p-4 sm:p-6 bg-white">
          <div className="flex items-start justify-between gap-3 mb-3">
            <select
              className="border border-black/15 rounded px-2 py-1 text-xs bg-stone-50"
              value={level}
              onChange={(event) =>
                onUpdate(index, { ...block.content, level: Number(event.target.value) })
              }
            >
              <option value={2}>Heading 2</option>
              <option value={3}>Heading 3</option>
            </select>
            {renderControls}
          </div>
          <RichTextarea
            rows={1}
            variant={level === 3 ? 'compact' : 'article-title'}
            toolbar="minimal"
            singleLine
            bordered={false}
            value={block.content?.text || ''}
            onChange={(text) => onUpdate(index, { ...block.content, text })}
            placeholder="Heading text"
          />
        </div>
      );
    }
    case 'text':
      return (
        <div className="p-4 sm:p-6 bg-white">
          <div className="flex justify-end mb-2">{renderControls}</div>
          <RichTextarea
            rows={6}
            variant="article"
            bordered={false}
            value={block.content?.body || ''}
            onChange={(body) => onUpdate(index, { ...block.content, body })}
            placeholder="Write your article text"
            hint="Tip: draft in Google Docs, then paste here — formatting adapts to your site layout."
          />
        </div>
      );
    case 'image':
      return (
        <div className="p-4 sm:p-6 bg-white space-y-4">
          <div className="flex justify-end">{renderControls}</div>
          {block.content?.src ? (
            <ImageWithCaption
              src={block.content.src}
              alt={block.content.alt || ''}
              caption={block.content.caption || block.content.alt || ''}
            />
          ) : (
            <div className="border border-dashed border-black/20 rounded-lg p-8 text-center text-sm text-black/50">
              Upload an image for this block
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <ImageUploadButton
              label={uploading ? 'Uploading...' : 'Upload image'}
              onChange={(event) => event.target.files?.[0] && onUpload(index, event.target.files[0])}
              disabled={uploading}
            />
          </div>
          <RichTextarea
            rows={1}
            variant="compact"
            toolbar="minimal"
            singleLine
            bordered
            value={block.content?.alt || ''}
            onChange={(alt) => onUpdate(index, { ...block.content, alt })}
            placeholder="Alt text"
          />
          <RichTextarea
            rows={1}
            variant="compact"
            toolbar="inline"
            singleLine
            bordered
            value={block.content?.caption || ''}
            onChange={(caption) => onUpdate(index, { ...block.content, caption })}
            placeholder="Optional figure caption"
          />
        </div>
      );
    case 'image_grid':
      return (
        <div className="p-4 sm:p-6 bg-white space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <select
              className="border border-black/15 rounded px-2 py-1 text-sm bg-stone-50"
              value={block.content?.cols || 3}
              onChange={(event) =>
                onUpdate(index, { ...block.content, cols: Number(event.target.value) })
              }
            >
              <option value={2}>2 columns</option>
              <option value={3}>3 columns</option>
              <option value={4}>4 columns</option>
            </select>
            {renderControls}
          </div>
          {(block.content?.images || []).filter((img) => img.src).length > 0 ? (
            <ImageGridWithCaptions
              images={(block.content?.images || []).filter((img) => img.src)}
              cols={block.content?.cols || 3}
              caption={block.content?.caption || ''}
            />
          ) : (
            <div className="border border-dashed border-black/20 rounded-lg p-8 text-center text-sm text-black/50">
              Add images to this grid
            </div>
          )}
          <div className="space-y-3">
            {(block.content?.images || []).map((image, imageIndex) => (
              <div key={`grid-image-${imageIndex}`} className="border border-black/10 rounded-lg p-3 space-y-2">
                {image.src ? (
                  <div className="relative w-full max-w-xs aspect-square">
                    <Image src={image.src} alt={image.alt || ''} fill className="object-cover rounded" unoptimized />
                  </div>
                ) : null}
                <ImageUploadButton
                  label={uploading ? 'Uploading...' : `Upload image ${imageIndex + 1}`}
                  onChange={(event) =>
                    event.target.files?.[0] && onUpload(index, event.target.files[0], imageIndex)
                  }
                  disabled={uploading}
                />
                <RichTextarea
                  rows={1}
                  variant="compact"
                  toolbar="minimal"
                  singleLine
                  bordered
                  value={image.alt || ''}
                  onChange={(alt) => {
                    const images = [...(block.content.images || [])];
                    images[imageIndex] = { ...images[imageIndex], alt };
                    onUpdate(index, { ...block.content, images });
                  }}
                  placeholder="Alt text"
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            className="px-3 py-1 border rounded text-sm"
            onClick={() =>
              onUpdate(index, {
                ...block.content,
                images: [...(block.content?.images || []), { src: '', alt: '' }],
              })
            }
          >
            + Add image slot
          </button>
          <RichTextarea
            rows={1}
            variant="compact"
            toolbar="inline"
            singleLine
            bordered
            value={block.content?.caption || ''}
            onChange={(caption) => onUpdate(index, { ...block.content, caption })}
            placeholder="Grid caption"
          />
        </div>
      );
    default:
      return null;
  }
}
