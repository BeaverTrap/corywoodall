'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { uploadStudioImage } from '@/lib/uploads/client';
import StudioEditorShell from '@/app/studio/components/StudioEditorShell';
import WysiwygSection from '@/app/studio/components/WysiwygSection';
import StudioSaveBar from '@/app/studio/components/StudioSaveBar';
import DeleteConfirmButton from '@/app/studio/components/DeleteConfirmButton';
import { useUnsavedChanges } from '@/app/studio/hooks/useUnsavedChanges';
import { useStudioAutoSave } from '@/app/studio/hooks/useStudioAutoSave';
import { hasRichTextContent, stripHtmlToText } from '@/lib/studio/richTextContent';
import {
  GalleryDetailsEditable,
  GalleryImagesEditable,
} from '@/app/studio/components/GalleryEditableSections';

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

  const [series, setSeries] = useState(initialSeries || emptySeries);
  const [images, setImages] = useState(initialImages);
  const isNew = !series.id;
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

  const saveSeries = async ({ auto = false } = {}) => {
    if (!hasRichTextContent(series.title)) return;

    setSaving(true);
    if (!auto) setMessage('');

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
      setSeries((prev) => ({ ...prev, id: data.id }));
    } else {
      const { error } = await supabase.from('gallery_series').update(payload).eq('id', series.id);
      if (error) {
        setMessage(error.message);
        setMessageTone('error');
        setSaving(false);
        return;
      }
    }

    const nextImages = [...images];

    for (let index = 0; index < nextImages.length; index += 1) {
      const image = nextImages[index];
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
        const { data, error } = await supabase
          .from('gallery_images')
          .insert(imagePayload)
          .select('id')
          .single();
        if (error) {
          setMessage(error.message);
          setMessageTone('error');
          setSaving(false);
          return;
        }
        nextImages[index] = { ...image, id: data.id };
      }
    }

    setImages(nextImages);
    setSeries((prev) => ({ ...prev, id: seriesId }));

    setSaving(false);
    setMessage(
      auto
        ? 'Auto-saved — gallery updates are live when published.'
        : 'Saved — gallery updates are live when published.'
    );
    setMessageTone('success');
    setSavedSnapshot(JSON.stringify({ series: { ...series, id: seriesId }, images: nextImages }));

    if (!auto) {
      router.push(`/studio/galleries/${seriesId}`);
      router.refresh();
    }
  };

  useStudioAutoSave({
    enabled: hasRichTextContent(series.title) && !saving && !uploading,
    isDirty,
    onAutoSave: () => saveSeries({ auto: true }),
  });

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
        setSeries((prev) => ({ ...prev, cover_image_url: publicUrl }));
      }

      setMessage('Image uploaded. Changes auto-save after a short pause.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Image upload failed.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const uploadImagesBulk = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setUploading(true);
    setMessage(`Uploading ${files.length} image${files.length > 1 ? 's' : ''}...`);
    setMessageTone('info');

    try {
      const uploaded = [];
      for (const file of files) {
        const publicUrl = await uploadStudioImage(file, 'galleries', 'gallery');
        uploaded.push({
          image_url: publicUrl,
          thumbnail_url: publicUrl,
          alt_text: file.name.replace(/\.[^.]+$/, ''),
        });
      }

      setImages((prev) => [...prev, ...uploaded]);

      if (!series.cover_image_url && uploaded[0]?.image_url) {
        setSeries((prev) => ({ ...prev, cover_image_url: uploaded[0].image_url }));
      }

      setMessage(
        `${uploaded.length} image${uploaded.length > 1 ? 's' : ''} uploaded. Changes auto-save after a short pause.`
      );
      setMessageTone('info');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Image upload failed.');
      setMessageTone('error');
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
      setSeries((prev) => ({ ...prev, cover_image_url: publicUrl }));
      setMessage('Cover image uploaded. Changes auto-save after a short pause.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Cover upload failed.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
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
          <div>
            <Link href="/studio/galleries" className="text-sm text-black/60 hover:underline">
              ← Back to galleries
            </Link>
            <h2 className="text-3xl font-bold mt-2">{isNew ? 'New gallery' : 'Edit gallery'}</h2>
            {isDirty ? <p className="text-sm text-amber-700 mt-2">Unsaved changes</p> : null}
          </div>
        }
      >
        <WysiwygSection label="Gallery details">
          <GalleryDetailsEditable
            series={series}
            onChange={setSeries}
            onUploadCover={uploadCover}
            uploading={uploading}
            isNew={isNew}
          />
        </WysiwygSection>

        <WysiwygSection label="Gallery images">
          <GalleryImagesEditable
            images={images}
            uploading={uploading}
            onUpload={uploadImage}
            onUploadBulk={uploadImagesBulk}
            onReorder={setImages}
            onUpdateAlt={(index, alt_text) =>
              setImages((prev) => prev.map((item, i) => (i === index ? { ...item, alt_text } : item)))
            }
            onRemove={removeImage}
            onSetCover={(imageUrl) => setSeries((prev) => ({ ...prev, cover_image_url: imageUrl }))}
          />
        </WysiwygSection>

        {!isNew ? (
          <section className="bg-white border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Delete gallery</h3>
            <p className="text-sm text-black/70 mb-4">
              Permanently remove &ldquo;{stripHtmlToText(series.title)}&rdquo; and all of its images. This cannot be
              undone.
            </p>
            <DeleteConfirmButton
              label="Delete gallery"
              confirmMessage={`Delete "${stripHtmlToText(series.title)}"? All images in this gallery will be removed permanently.`}
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
        disabled={!hasRichTextContent(series.title)}
        viewHref={viewHref}
        viewLabel="View on homepage"
        message={message}
        messageTone={messageTone}
      />
    </>
  );
}
