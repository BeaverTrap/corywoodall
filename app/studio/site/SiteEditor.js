'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { defaultHomeContent, defaultArticlesIndexContent, defaultSiteMeta } from '@/lib/content/staticSite';
import { uploadStudioImage } from '@/lib/uploads/client';
import ImageUploadButton from '@/app/studio/components/ImageUploadButton';
import { presetHint } from '@/lib/uploads/presets';
import StudioEditorShell from '@/app/studio/components/StudioEditorShell';
import EditorPreviewRow from '@/app/studio/components/EditorPreviewRow';
import SortableList from '@/app/studio/components/SortableList';
import ReorderControls from '@/app/studio/components/ReorderControls';
import StudioSaveBar from '@/app/studio/components/StudioSaveBar';
import { useUnsavedChanges } from '@/app/studio/hooks/useUnsavedChanges';
import { useStudioAutoSave } from '@/app/studio/hooks/useStudioAutoSave';
import {
  SiteHeroPreview,
  SiteAboutPreview,
  SiteContactPreview,
  SiteFaqPreview,
  SiteArticlesIndexPreview,
  SiteSeoPreview,
} from '@/app/studio/components/SitePreviewSections';

function emptyFaqItem() {
  return { question: '', answer: '', showArticlesLink: false };
}

export default function SiteEditor({ initialSections }) {
  const supabase = createClient();
  const [home, setHome] = useState(initialSections?.home || defaultHomeContent);
  const [articlesIndex, setArticlesIndex] = useState(
    initialSections?.articles_index || defaultArticlesIndexContent
  );
  const [siteMeta, setSiteMeta] = useState(initialSections?.site_meta || defaultSiteMeta);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageTone, setMessageTone] = useState('info');
  const [savedSnapshot, setSavedSnapshot] = useState('');

  const currentSnapshot = useMemo(
    () => JSON.stringify({ home, articlesIndex, siteMeta }),
    [home, articlesIndex, siteMeta]
  );
  const isDirty = Boolean(savedSnapshot) && currentSnapshot !== savedSnapshot;
  useUnsavedChanges(isDirty);

  useEffect(() => {
    if (initialSections?.home) setHome(initialSections.home);
    if (initialSections?.articles_index) setArticlesIndex(initialSections.articles_index);
    if (initialSections?.site_meta) setSiteMeta(initialSections.site_meta);
  }, [initialSections]);

  useEffect(() => {
    const snapshot = JSON.stringify({
      home: initialSections?.home || defaultHomeContent,
      articlesIndex: initialSections?.articles_index || defaultArticlesIndexContent,
      siteMeta: initialSections?.site_meta || defaultSiteMeta,
    });
    setSavedSnapshot(snapshot);
  }, [initialSections]);

  const saveAll = async ({ auto = false } = {}) => {
    setSaving(true);
    if (!auto) setMessage('');

    const updates = [
      supabase.from('site_sections').upsert({
        key: 'home',
        content: home,
        updated_at: new Date().toISOString(),
      }),
      supabase.from('site_sections').upsert({
        key: 'articles_index',
        content: articlesIndex,
        updated_at: new Date().toISOString(),
      }),
      supabase.from('site_sections').upsert({
        key: 'site_meta',
        content: siteMeta,
        updated_at: new Date().toISOString(),
      }),
    ];

    const results = await Promise.all(updates);
    const error = results.find((result) => result.error)?.error;

    setSaving(false);
    if (error) {
      setMessage(error.message);
      setMessageTone('error');
      return;
    }

    setSavedSnapshot(currentSnapshot);
    setMessage(
      auto
        ? 'Auto-saved — your changes are live on the public site.'
        : 'Saved — your changes are live on the public site.'
    );
    setMessageTone('success');
  };

  useStudioAutoSave({
    enabled: !saving && !uploading,
    isDirty,
    onAutoSave: () => saveAll({ auto: true }),
  });

  const uploadBackground = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage('Uploading background image...');

    try {
      const publicUrl = await uploadStudioImage(file, 'site');

      setHome((prev) => ({
        ...prev,
        hero: { ...prev.hero, backgroundImage: publicUrl },
      }));
      setMessage('Background uploaded. Click Save site content to publish.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Image upload failed.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const updateParagraph = (index, value) => {
    setHome((prev) => {
      const paragraphs = [...prev.about.paragraphs];
      paragraphs[index] = value;
      return { ...prev, about: { ...prev.about, paragraphs } };
    });
  };

  const updateFaqItem = (index, field, value) => {
    setHome((prev) => {
      const items = [...prev.faq.items];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, faq: { ...prev.faq, items } };
    });
  };

  return (
    <>
    <StudioEditorShell
      header={
        <>
          <div>
            <Link href="/studio" className="text-sm text-black/60 hover:underline">
              ← Back to dashboard
            </Link>
            <h2 className="text-3xl font-bold mt-2">Edit site content</h2>
            <p className="text-black/70 mt-1">
              Hero, about, contact, FAQ, articles page, and SEO text for the public site.
            </p>
            {isDirty ? <p className="text-sm text-amber-700 mt-2">Unsaved changes</p> : null}
          </div>
        </>
      }
    >
      <EditorPreviewRow
        label="Hero preview"
        preview={<SiteHeroPreview hero={home.hero} />}
        editor={
          <section id="hero" className="bg-white border border-black/10 rounded-lg p-6 space-y-4 h-full">
            <h3 className="text-xl font-semibold">Hero</h3>
            <input
              className="w-full border border-black/20 rounded px-3 py-2"
              value={home.hero.name}
              onChange={(e) => setHome((prev) => ({ ...prev, hero: { ...prev.hero, name: e.target.value } }))}
              placeholder="Name"
            />
            <input
              className="w-full border border-black/20 rounded px-3 py-2"
              value={home.hero.subtitle}
              onChange={(e) =>
                setHome((prev) => ({ ...prev, hero: { ...prev.hero, subtitle: e.target.value } }))
              }
              placeholder="Subtitle"
            />
            <textarea
              rows={3}
              className="w-full border border-black/20 rounded px-3 py-2"
              value={home.hero.tagline}
              onChange={(e) => setHome((prev) => ({ ...prev, hero: { ...prev.hero, tagline: e.target.value } }))}
              placeholder="Tagline"
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium">Hero background image</label>
              {home.hero.backgroundImage ? (
                <img
                  src={home.hero.backgroundImage}
                  alt="Hero background"
                  className="max-h-40 rounded border border-black/10 object-cover"
                />
              ) : null}
              <ImageUploadButton
                label={uploading ? 'Uploading...' : 'Upload background image'}
                onChange={uploadBackground}
                disabled={uploading}
              />
              <p className="text-xs text-black/50">{presetHint('hero')}</p>
              <input
                className="w-full border border-black/20 rounded px-3 py-2"
                value={home.hero.backgroundImage}
                onChange={(e) =>
                  setHome((prev) => ({ ...prev, hero: { ...prev.hero, backgroundImage: e.target.value } }))
                }
                placeholder="Or paste image URL"
              />
            </div>
          </section>
        }
      />

      <EditorPreviewRow
        label="About preview"
        preview={<SiteAboutPreview about={home.about} />}
        editor={
          <section id="about" className="bg-white border border-black/10 rounded-lg p-6 space-y-4 h-full">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xl font-semibold">About</h3>
              <button
                type="button"
                className="text-sm px-3 py-1 border rounded"
                onClick={() =>
                  setHome((prev) => ({
                    ...prev,
                    about: { paragraphs: [...prev.about.paragraphs, ''] },
                  }))
                }
              >
                Add paragraph
              </button>
            </div>
            <SortableList
              items={home.about.paragraphs}
              onReorder={(paragraphs) =>
                setHome((prev) => ({ ...prev, about: { ...prev.about, paragraphs } }))
              }
              getItemKey={(_, index) => `about-${index}`}
              renderItem={(paragraph, index, { dragHandleProps }) => (
                <div className="space-y-2">
                  <textarea
                    rows={4}
                    className="w-full border border-black/20 rounded px-3 py-2"
                    value={paragraph}
                    onChange={(e) => updateParagraph(index, e.target.value)}
                  />
                  <ReorderControls
                    dragHandleProps={dragHandleProps}
                    onRemove={() =>
                      setHome((prev) => ({
                        ...prev,
                        about: {
                          paragraphs: prev.about.paragraphs.filter((_, i) => i !== index),
                        },
                      }))
                    }
                    removeLabel="Remove paragraph"
                  />
                </div>
              )}
            />
            <p className="text-xs text-black/50">
              You can use simple HTML in paragraphs, e.g. &lt;strong&gt;Cory Woodall&lt;/strong&gt; for bold.
            </p>
          </section>
        }
      />

      <EditorPreviewRow
        label="Contact preview"
        preview={<SiteContactPreview contact={home.contact} />}
        editor={
          <section id="contact" className="bg-white border border-black/10 rounded-lg p-6 space-y-4 h-full">
            <h3 className="text-xl font-semibold">Contact</h3>
            <input
              className="w-full border border-black/20 rounded px-3 py-2"
              value={home.contact.heading}
              onChange={(e) =>
                setHome((prev) => ({ ...prev, contact: { ...prev.contact, heading: e.target.value } }))
              }
              placeholder="Section heading"
            />
            <textarea
              rows={2}
              className="w-full border border-black/20 rounded px-3 py-2"
              value={home.contact.intro}
              onChange={(e) =>
                setHome((prev) => ({ ...prev, contact: { ...prev.contact, intro: e.target.value } }))
              }
            />
            <input
              className="w-full border border-black/20 rounded px-3 py-2"
              value={home.contact.email}
              onChange={(e) =>
                setHome((prev) => ({ ...prev, contact: { ...prev.contact, email: e.target.value } }))
              }
              placeholder="Email"
            />
            <input
              className="w-full border border-black/20 rounded px-3 py-2"
              value={home.contact.location}
              onChange={(e) =>
                setHome((prev) => ({ ...prev, contact: { ...prev.contact, location: e.target.value } }))
              }
              placeholder="Location"
            />
            <input
              className="w-full border border-black/20 rounded px-3 py-2"
              value={home.contact.footerNote}
              onChange={(e) =>
                setHome((prev) => ({ ...prev, contact: { ...prev.contact, footerNote: e.target.value } }))
              }
              placeholder="Footer note"
            />
          </section>
        }
      />

      <EditorPreviewRow
        label="FAQ preview"
        preview={<SiteFaqPreview faq={home.faq} />}
        editor={
          <section id="faq" className="bg-white border border-black/10 rounded-lg p-6 space-y-4 h-full">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xl font-semibold">FAQ</h3>
              <button
                type="button"
                className="text-sm px-3 py-1 border rounded"
                onClick={() =>
                  setHome((prev) => ({
                    ...prev,
                    faq: { ...prev.faq, items: [...prev.faq.items, emptyFaqItem()] },
                  }))
                }
              >
                Add question
              </button>
            </div>
            <input
              className="w-full border border-black/20 rounded px-3 py-2"
              value={home.faq.title}
              onChange={(e) =>
                setHome((prev) => ({ ...prev, faq: { ...prev.faq, title: e.target.value } }))
              }
              placeholder="FAQ section title"
            />
            <SortableList
              items={home.faq.items}
              onReorder={(items) => setHome((prev) => ({ ...prev, faq: { ...prev.faq, items } }))}
              getItemKey={(_, index) => `faq-${index}`}
              renderItem={(item, index, { dragHandleProps }) => (
                <div className="border border-black/10 rounded p-4 space-y-3">
                  <input
                    className="w-full border border-black/20 rounded px-3 py-2 font-medium"
                    value={item.question}
                    onChange={(e) => updateFaqItem(index, 'question', e.target.value)}
                    placeholder="Question"
                  />
                  <textarea
                    rows={4}
                    className="w-full border border-black/20 rounded px-3 py-2"
                    value={item.answer}
                    onChange={(e) => updateFaqItem(index, 'answer', e.target.value)}
                    placeholder="Answer"
                  />
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={Boolean(item.showArticlesLink)}
                      onChange={(e) => updateFaqItem(index, 'showArticlesLink', e.target.checked)}
                    />
                    Show link to articles section
                  </label>
                  <ReorderControls
                    dragHandleProps={dragHandleProps}
                    onRemove={() =>
                      setHome((prev) => ({
                        ...prev,
                        faq: {
                          ...prev.faq,
                          items: prev.faq.items.filter((_, i) => i !== index),
                        },
                      }))
                    }
                  />
                </div>
              )}
            />
          </section>
        }
      />

      <EditorPreviewRow
        label="Articles page preview"
        preview={<SiteArticlesIndexPreview articlesIndex={articlesIndex} />}
        editor={
          <section className="bg-white border border-black/10 rounded-lg p-6 space-y-4 h-full">
            <h3 className="text-xl font-semibold">Articles page</h3>
            <input
              className="w-full border border-black/20 rounded px-3 py-2"
              value={articlesIndex.title}
              onChange={(e) => setArticlesIndex((prev) => ({ ...prev, title: e.target.value }))}
            />
            <textarea
              rows={2}
              className="w-full border border-black/20 rounded px-3 py-2"
              value={articlesIndex.subtitle}
              onChange={(e) => setArticlesIndex((prev) => ({ ...prev, subtitle: e.target.value }))}
            />
          </section>
        }
      />

      <EditorPreviewRow
        label="SEO preview"
        preview={<SiteSeoPreview siteMeta={siteMeta} />}
        editor={
          <section className="bg-white border border-black/10 rounded-lg p-6 space-y-4 h-full">
            <h3 className="text-xl font-semibold">Site SEO</h3>
            <input
              className="w-full border border-black/20 rounded px-3 py-2"
              value={siteMeta.title}
              onChange={(e) => setSiteMeta((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Browser tab title"
            />
            <textarea
              rows={2}
              className="w-full border border-black/20 rounded px-3 py-2"
              value={siteMeta.description}
              onChange={(e) => setSiteMeta((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Meta description"
            />
          </section>
        }
      />

      <p className="text-sm text-black/60">
        Portfolio galleries are edited separately under{' '}
        <Link href="/studio/galleries" className="underline">
          Galleries
        </Link>
        . Use move up/down on the galleries list to set homepage order.
      </p>
    </StudioEditorShell>
    <StudioSaveBar
      saveLabel="Save all changes"
      onSave={saveAll}
      saving={saving}
      viewHref="/"
      viewLabel="View homepage"
      message={message}
      messageTone={messageTone}
    />
    </>
  );
}
