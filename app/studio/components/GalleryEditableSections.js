'use client';

import Image from 'next/image';
import ImageUploadButton from '@/app/studio/components/ImageUploadButton';
import RichTextarea from '@/app/studio/components/RichTextarea';
import PublishedToggle from '@/app/studio/components/PublishedToggle';
import StudioMetaFields, { StudioMetaInput } from '@/app/studio/components/StudioMetaFields';
import SortableList from '@/app/studio/components/SortableList';
import ReorderControls from '@/app/studio/components/ReorderControls';
import { presetHint } from '@/lib/uploads/presets';
import { slugify } from '@/lib/content/queries';
import { stripHtmlToText } from '@/lib/studio/richTextContent';

export function GalleryDetailsEditable({ series, onChange, onUploadCover, uploading, isNew }) {
  const update = (field, value) => {
    const next = { ...series, [field]: value };
    if (field === 'title' && (isNew || !series.slug)) {
      next.slug = slugify(stripHtmlToText(value));
    }
    onChange(next);
  };

  const cover = series.cover_image_url;
  const description = series.description || '';
  const isRich = description.includes('<');
  const [intro, ...works] = isRich ? [description] : description.split('\n\n');

  return (
    <div className="bg-stone-100">
      <div className="flex flex-col md:flex-row gap-6 p-4 md:p-6">
        <div className="w-full md:w-1/3 flex-shrink-0">
          <div className="relative aspect-square bg-white rounded overflow-hidden border border-black/10 max-w-[280px] mx-auto">
            {cover ? (
              <Image src={cover} alt={stripHtmlToText(series.title) || 'Cover'} fill className="object-contain" unoptimized />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-black/40">
                No cover image
              </div>
            )}
          </div>
        </div>
        <div className="w-full md:w-2/3 space-y-4">
          <RichTextarea
            rows={1}
            variant="article-title"
            toolbar="minimal"
            singleLine
            bordered={false}
            value={series.title}
            onChange={(value) => update('title', value)}
            placeholder="Gallery title"
          />
          <div className="backdrop-blur-md bg-white/80 p-4 rounded-lg border border-white/20 shadow">
            <RichTextarea
              rows={5}
              variant="gallery"
              bordered={false}
              value={isRich ? description : intro || ''}
              onChange={(value) => update('description', value)}
              placeholder="Series overview"
              hint={
                isRich
                  ? undefined
                  : 'Use a blank line, then list individual works on separate lines (plain text only).'
              }
            />
            {!isRich && works.length > 0 ? (
              <textarea
                rows={4}
                className="w-full mt-3 border border-black/15 rounded px-3 py-2 text-sm"
                value={works.join('\n\n')}
                onChange={(event) => {
                  const introText = (intro || '').trim();
                  const worksText = event.target.value.trim();
                  update('description', worksText ? `${introText}\n\n${worksText}` : introText);
                }}
                placeholder="Works list (one per line)"
              />
            ) : null}
          </div>
        </div>
      </div>
      <StudioMetaFields>
        <StudioMetaInput
          label="URL slug"
          value={series.slug}
          onChange={(value) => update('slug', slugify(value))}
        />
        <div>
          <label className="block text-xs font-medium text-black/60 mb-1">Cover image</label>
          {series.cover_image_url ? (
            <img
              src={series.cover_image_url}
              alt="Gallery cover"
              className="mb-3 max-h-32 rounded border border-black/10 object-cover"
            />
          ) : null}
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <ImageUploadButton
              label={uploading ? 'Uploading...' : 'Upload cover'}
              onChange={onUploadCover}
              disabled={uploading}
            />
            <span className="text-xs text-black/50">or paste URL</span>
          </div>
          <p className="text-xs text-black/50 mb-2">{presetHint('cover')}</p>
          <input
            className="w-full border border-black/15 rounded px-3 py-2 text-sm bg-white"
            value={series.cover_image_url || ''}
            onChange={(event) => update('cover_image_url', event.target.value)}
            placeholder="https://res.cloudinary.com/..."
          />
        </div>
        <PublishedToggle
          published={series.published}
          onChange={(value) => update('published', value)}
          checkboxLabel="Published on homepage"
          draftNote="This gallery is hidden. Visitors will not see it on the homepage portfolio."
          liveNote="This gallery appears in the homepage portfolio section."
        />
        <p className="text-xs text-black/50">
          Homepage order is set by dragging galleries on the galleries list.
        </p>
      </StudioMetaFields>
    </div>
  );
}

export function GalleryImagesEditable({
  images,
  uploading,
  onUpload,
  onUploadBulk,
  onReorder,
  onUpdateAlt,
  onRemove,
  onSetCover,
}) {
  return (
    <div className="bg-stone-100 p-4 md:p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-black/70">Photos appear in the homepage lightbox in this order.</p>
          <p className="text-xs text-black/50 mt-1">{presetHint('gallery')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ImageUploadButton
            label={uploading ? 'Uploading...' : '+ Add image'}
            onChange={onUpload}
            disabled={uploading}
          />
          <ImageUploadButton
            label={uploading ? 'Uploading...' : '+ Add multiple'}
            onChange={onUploadBulk}
            disabled={uploading}
            multiple
          />
        </div>
      </div>

      {images.length === 0 ? (
        <p className="text-sm text-black/60 border border-dashed border-black/20 rounded-lg p-6 text-center">
          No images yet. Upload one or many to build this gallery.
        </p>
      ) : (
        <SortableList
          items={images}
          onReorder={onReorder}
          getItemKey={(image, index) => image.id || `${image.image_url}-${index}`}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          renderItem={(image, index, { dragHandleProps }) => (
            <div className="border border-black/10 rounded-lg p-3 bg-white space-y-2">
              <img
                src={image.thumbnail_url || image.image_url}
                alt={image.alt_text || 'Gallery image'}
                className="w-full aspect-square object-cover rounded"
              />
              <input
                className="w-full border border-black/15 rounded px-2 py-1 text-sm"
                value={image.alt_text || ''}
                onChange={(event) => onUpdateAlt(index, event.target.value)}
                placeholder="Caption / alt text"
              />
              <div className="flex flex-wrap gap-2">
                <ReorderControls dragHandleProps={dragHandleProps} onRemove={() => onRemove(index)} />
                <button
                  type="button"
                  className="px-3 py-1 border rounded text-sm"
                  onClick={() => onSetCover(image.image_url)}
                >
                  Set as cover
                </button>
              </div>
            </div>
          )}
        />
      )}
    </div>
  );
}
