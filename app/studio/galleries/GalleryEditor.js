'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/content/queries';
import { uploadStudioImage } from '@/lib/uploads/client';
import ImageUploadButton from '@/app/studio/components/ImageUploadButton';
import { presetHint } from '@/lib/uploads/presets';
import StudioEditorShell from '@/app/studio/components/StudioEditorShell';
import EditorPreviewRow from '@/app/studio/components/EditorPreviewRow';
import ReorderButtons from '@/app/studio/components/ReorderButtons';
import StudioSaveBar from '@/app/studio/components/StudioSaveBar';
import PublishedToggle from '@/app/studio/components/PublishedToggle';
import DeleteConfirmButton from '@/app/studio/components/DeleteConfirmButton';
import { useUnsavedChanges } from '@/app/studio/hooks/useUnsavedChanges';
import { GalleryDetailsPreview, GalleryImagesPreview } from '@/app/studio/components/GalleryPreviewSections';

const emptySeries = {
  title: '',
  slug: '',
  description: '',
  cover_image_url: '',
  sort_order: 0,
  published: false,
};

export default function GalleryEditor({ initialSeries = null, initialImages = [] }) {
  const router = useRouter();
  const supabase = createClient();
  const isNew = !initialSeries?.id;

  const [series, setSeries] = useState(initialSeries || emptySeries);
  const [images, setImages] = useState(initialImages);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageTone, setMessageTone] = useState('info');
  const [savedSnapshot, setSavedSnapshot] = useState('');

  const currentSnapshot = useMemo(() => JSON.stringify({ series, images }), [series, images]);
  const isDirty = Boolean(savedSnapshot) && currentSnapshot !== savedSnapshot;
  useUnsavedChanges(isDirty);

  useEffect(() => {
    setSavedSnapshot(JSON.stringify({ series: initialSeries || emptySeries, images: initialImages }));
  }, [initialSeries, initialImages]);

  const viewHref = series.published && series.slug ? '/#portfolio' : null;

  const updateSeries = (field, value) => {
    setSeries((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'title' && (isNew || !prev.slug)) {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  const saveSeries = async () => {
    setSaving(true);
    setMessage('');

    const payload = {
      title: series.title,
      slug: series.slug,
      description: series.description,
      cover_image_url: series.cover_image_url || images[0]?.image_url || null,
      sort_order: Number(series.sort_order) || 0,
      published: Boolean(series.published),
      updated_at: new Date().toISOString(),
    };

    let seriesId = series.id;

    if (isNew) {
      const { data, error } = await supabase
        .from('gallery_series')
        .insert(payload)
        .select('id')
        .single();
      if (error) {
        setMessage(error.message);
        setMessageTone('error');
        setSaving(false);
        return;
      }
      seriesId = data.id;
    } else {
      const { error } = await supabase.from('gallery_series').update(payload).eq('id', series.id);
      if (error) {
        setMessage(error.message);
        setMessageTone('error');
        setSaving(false);
        return;
      }
    }

    for (let index = 0; index < images.length; index += 1) {
      const image = images[index];
      const imagePayload = {
        series_id: seriesId,
        image_url: image.image_url,
        thumbnail_url: image.thumbnail_url || image.image_url,
        alt_text: image.alt_text || '',
        sort_order: index,
      };

      if (image.id) {
        const { error } = await supabase
          .from('gallery_images')
          .update(imagePayload)
          .eq('id', image.id);
        if (error) {
          setMessage(error.message);
          setMessageTone('error');
          setSaving(false);
          return;
        }
      } else {
        const { error } = await supabase.from('gallery_images').insert(imagePayload);
        if (error) {
          setMessage(error.message);
          setMessageTone('error');
          setSaving(false);
          return;
        }
      }
    }

    setSaving(false);
    setMessage('Saved — gallery updates are live when published.');
    setMessageTone('success');
    setSavedSnapshot(currentSnapshot);
    router.push(`/studio/galleries/${seriesId}`);
    router.refresh();
  };

  const uploadImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage('Uploading image...');

    try {
      const publicUrl = await uploadStudioImage(file, 'galleries', 'gallery');

      setImages((prev) => [
        ...prev,
        {
          image_url: publicUrl,
          thumbnail_url: publicUrl,
          alt_text: file.name.replace(/\.[^.]+$/, ''),
        },
      ]);

      if (!series.cover_image_url) {
        updateSeries('cover_image_url', publicUrl);
      }

      setMessage('Image uploaded. Click Save gallery when you are done editing.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Image upload failed.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const uploadCover = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage('Uploading cover image...');

    try {
      const publicUrl = await uploadStudioImage(file, 'galleries', 'cover');
      updateSeries('cover_image_url', publicUrl);
      setMessage('Cover image uploaded. Click Save gallery when you are done editing.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Cover upload failed.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const moveImage = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    setImages(next);
  };

  const removeImage = async (index) => {
    const image = images[index];
    if (image.id) {
      await supabase.from('gallery_images').delete().eq('id', image.id);
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const deleteGallery = async () => {
    if (!series.id) return;

    const { error } = await supabase.from('gallery_series').delete().eq('id', series.id);
    if (error) {
      setMessage(error.message);
      setMessageTone('error');
      return;
    }

    router.push('/studio/galleries');
    router.refresh();
  };

  return (
    <>
    <StudioEditorShell
      header={
        <>
          <div>
            <Link href="/studio/galleries" className="text-sm text-black/60 hover:underline">
              ← Back to galleries
            </Link>
            <h2 className="text-3xl font-bold mt-2">{isNew ? 'New gallery' : 'Edit gallery'}</h2>
            {isDirty ? <p className="text-sm text-amber-700 mt-2">Unsaved changes</p> : null}
          </div>
        </>
      }
    >
      <EditorPreviewRow
        label="Gallery details preview"
        preview={<GalleryDetailsPreview series={series} />}
        editor={
          <section className="bg-white border border-black/10 rounded-lg p-6 space-y-4 h-full">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                className="w-full border border-black/20 rounded px-3 py-2"
                value={series.title}
                onChange={(e) => updateSeries('title', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">URL slug</label>
              <input
                className="w-full border border-black/20 rounded px-3 py-2"
                value={series.slug}
                onChange={(e) => updateSeries('slug', slugify(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                rows={6}
                className="w-full border border-black/20 rounded px-3 py-2"
                value={series.description}
                onChange={(e) => updateSeries('description', e.target.value)}
                placeholder="Series overview. Use a blank line, then list individual works on separate lines."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cover image</label>
              {series.cover_image_url ? (
                <img
                  src={series.cover_image_url}
                  alt="Gallery cover"
                  className="mb-3 max-h-40 rounded border border-black/10 object-cover"
                />
              ) : null}
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <ImageUploadButton
                  label={uploading ? 'Uploading...' : 'Upload cover image'}
                  onChange={uploadCover}
                  disabled={uploading}
                />
                <span className="text-xs text-black/50">or paste a URL below</span>
              </div>
              <p className="text-xs text-black/50 mb-2">{presetHint('cover')}</p>
              <input
                className="w-full border border-black/20 rounded px-3 py-2"
                value={series.cover_image_url || ''}
                onChange={(e) => updateSeries('cover_image_url', e.target.value)}
                placeholder="https://res.cloudinary.com/..."
              />
            </div>
            <PublishedToggle
              published={series.published}
              onChange={(value) => updateSeries('published', value)}
              checkboxLabel="Published on homepage"
              draftNote="This gallery is hidden. Visitors will not see it on the homepage portfolio."
              liveNote="This gallery appears in the homepage portfolio section."
            />
            <p className="text-xs text-black/50">
              Homepage order is set with move up/down on the galleries list.
            </p>
          </section>
        }
      />

      <EditorPreviewRow
        label="Gallery images preview"
        preview={<GalleryImagesPreview images={images} />}
        editor={
          <section className="bg-white border border-black/10 rounded-lg p-6 space-y-4 h-full">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold">Gallery images</h3>
                <p className="text-sm text-black/60 mt-1">
                  Upload photos here. They are stored on Cloudinary, not in Supabase.
                </p>
                <p className="text-xs text-black/50 mt-1">{presetHint('gallery')}</p>
              </div>
              <ImageUploadButton
                label={uploading ? 'Uploading...' : '+ Add image'}
                onChange={uploadImage}
                disabled={uploading}
              />
            </div>

            {images.length === 0 ? (
              <p className="text-sm text-black/60">No images yet. Upload images to build this gallery.</p>
            ) : null}

            <div className="space-y-4">
              {images.map((image, index) => (
                <div key={image.id || `${image.image_url}-${index}`} className="border border-black/10 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <img
                      src={image.thumbnail_url || image.image_url}
                      alt={image.alt_text || 'Gallery image'}
                      className="w-full sm:w-32 h-32 object-cover rounded"
                    />
                    <div className="flex-1 space-y-3">
                      <input
                        className="w-full border border-black/20 rounded px-3 py-2"
                        value={image.alt_text || ''}
                        onChange={(e) =>
                          setImages((prev) =>
                            prev.map((item, i) =>
                              i === index ? { ...item, alt_text: e.target.value } : item
                            )
                          )
                        }
                        placeholder="Caption / alt text"
                      />
                      <div className="flex flex-wrap gap-2">
                        <ReorderButtons
                          disableUp={index === 0}
                          disableDown={index === images.length - 1}
                          onMoveUp={() => moveImage(index, -1)}
                          onMoveDown={() => moveImage(index, 1)}
                          onRemove={() => removeImage(index)}
                        />
                        <button
                          type="button"
                          className="px-3 py-1 border rounded text-sm"
                          onClick={() => updateSeries('cover_image_url', image.image_url)}
                        >
                          Set as cover
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        }
      />

      {!isNew ? (
        <section className="bg-white border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Delete gallery</h3>
          <p className="text-sm text-black/70 mb-4">
            Permanently remove &ldquo;{series.title}&rdquo; and all of its images. This cannot be undone.
          </p>
          <DeleteConfirmButton
            label="Delete gallery"
            confirmMessage={`Delete "${series.title}"? All images in this gallery will be removed permanently.`}
            onConfirm={deleteGallery}
            disabled={saving}
          />
        </section>
      ) : null}
    </StudioEditorShell>
    <StudioSaveBar
      saveLabel="Save gallery"
      onSave={saveSeries}
      saving={saving}
      disabled={!series.title}
      viewHref={viewHref}
      viewLabel="View on homepage"
      message={message}
      messageTone={messageTone}
    />
    </>
  );
}
