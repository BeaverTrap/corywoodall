'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/content/queries';
import { uploadStudioImage } from '@/lib/uploads/client';
import ImageUploadButton from '@/app/studio/components/ImageUploadButton';
import { presetHint } from '@/lib/uploads/presets';
import StudioEditorLayout from '@/app/studio/components/StudioEditorLayout';
import GalleryPreview from '@/app/studio/components/GalleryPreview';

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
        setSaving(false);
        return;
      }
      seriesId = data.id;
    } else {
      const { error } = await supabase.from('gallery_series').update(payload).eq('id', series.id);
      if (error) {
        setMessage(error.message);
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
          setSaving(false);
          return;
        }
      } else {
        const { error } = await supabase.from('gallery_images').insert(imagePayload);
        if (error) {
          setMessage(error.message);
          setSaving(false);
          return;
        }
      }
    }

    setSaving(false);
    setMessage('Saved.');
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

  return (
    <StudioEditorLayout
      preview={<GalleryPreview series={series} images={images} />}
      previewLabel="Gallery preview"
    >
      <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link href="/studio/galleries" className="text-sm text-black/60 hover:underline">
            ← Back to galleries
          </Link>
          <h2 className="text-3xl font-bold mt-2">{isNew ? 'New gallery' : 'Edit gallery'}</h2>
        </div>
        <button
          type="button"
          onClick={saveSeries}
          disabled={saving || !series.title}
          className="px-5 py-2.5 rounded-lg bg-black text-white disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save gallery'}
        </button>
      </div>

      {message && <p className="text-sm text-black/70">{message}</p>}

      <section className="bg-white border border-black/10 rounded-lg p-6 space-y-4">
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
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Display order</label>
            <input
              type="number"
              className="w-full border border-black/20 rounded px-3 py-2"
              value={series.sort_order}
              onChange={(e) => updateSeries('sort_order', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cover image</label>
            {series.cover_image_url && (
              <img
                src={series.cover_image_url}
                alt="Gallery cover"
                className="mb-3 max-h-40 rounded border border-black/10 object-cover"
              />
            )}
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
        </div>
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(series.published)}
            onChange={(e) => updateSeries('published', e.target.checked)}
          />
          Published on homepage
        </label>
      </section>

      <section className="bg-white border border-black/10 rounded-lg p-6 space-y-4">
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

        {images.length === 0 && (
          <p className="text-sm text-black/60">No images yet. Upload images to build this gallery.</p>
        )}

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
                    <button type="button" className="px-3 py-1 border rounded" onClick={() => moveImage(index, -1)}>
                      Move up
                    </button>
                    <button type="button" className="px-3 py-1 border rounded" onClick={() => moveImage(index, 1)}>
                      Move down
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1 border rounded text-red-700"
                      onClick={() => removeImage(index)}
                    >
                      Remove
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1 border rounded"
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
      </div>
    </StudioEditorLayout>
  );
}
