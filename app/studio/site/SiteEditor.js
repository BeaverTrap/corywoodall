'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { defaultHomeContent, defaultArticlesIndexContent, defaultSiteMeta } from '@/lib/content/staticSite';
import { uploadStudioImage } from '@/lib/uploads/client';
import StudioEditorShell from '@/app/studio/components/StudioEditorShell';
import WysiwygSection from '@/app/studio/components/WysiwygSection';
import SortableList from '@/app/studio/components/SortableList';
import StudioSaveBar from '@/app/studio/components/StudioSaveBar';
import { useUnsavedChanges } from '@/app/studio/hooks/useUnsavedChanges';
import { useStudioAutoSave } from '@/app/studio/hooks/useStudioAutoSave';
import {
  SiteHeroEditable,
  SiteAboutEditable,
  SiteContactEditable,
  SiteFaqEditable,
  SiteArticlesIndexEditable,
  SiteSeoEditable,
} from '@/app/studio/components/SiteEditableSections';

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
      setMessage('Background uploaded. Changes auto-save after a short pause.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Image upload failed.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <>
      <StudioEditorShell
        header={
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
        }
      >
        <WysiwygSection label="Hero" id="hero">
          <SiteHeroEditable
            hero={home.hero}
            onChange={(hero) => setHome((prev) => ({ ...prev, hero }))}
            onUploadBackground={uploadBackground}
            uploading={uploading}
          />
        </WysiwygSection>

        <WysiwygSection label="About" id="about">
          <SiteAboutEditable
            paragraphs={home.about.paragraphs}
            onChange={(paragraphs) =>
              setHome((prev) => ({ ...prev, about: { ...prev.about, paragraphs } }))
            }
            onReorder={(paragraphs) =>
              setHome((prev) => ({ ...prev, about: { ...prev.about, paragraphs } }))
            }
            onRemove={(index) =>
              setHome((prev) => ({
                ...prev,
                about: {
                  paragraphs: prev.about.paragraphs.filter((_, i) => i !== index),
                },
              }))
            }
            onAdd={() =>
              setHome((prev) => ({
                ...prev,
                about: { paragraphs: [...prev.about.paragraphs, ''] },
              }))
            }
          />
        </WysiwygSection>

        <WysiwygSection label="Contact" id="contact">
          <SiteContactEditable
            contact={home.contact}
            onChange={(contact) => setHome((prev) => ({ ...prev, contact }))}
          />
        </WysiwygSection>

        <WysiwygSection label="FAQ" id="faq">
          <SiteFaqEditable
            faq={home.faq}
            onChange={(faq) => setHome((prev) => ({ ...prev, faq }))}
            onAddItem={() =>
              setHome((prev) => ({
                ...prev,
                faq: { ...prev.faq, items: [...prev.faq.items, emptyFaqItem()] },
              }))
            }
            onReorderItems={(items) => setHome((prev) => ({ ...prev, faq: { ...prev.faq, items } }))}
            onRemoveItem={(index) =>
              setHome((prev) => ({
                ...prev,
                faq: {
                  ...prev.faq,
                  items: prev.faq.items.filter((_, i) => i !== index),
                },
              }))
            }
          />
        </WysiwygSection>

        <WysiwygSection label="Articles page">
          <SiteArticlesIndexEditable articlesIndex={articlesIndex} onChange={setArticlesIndex} />
        </WysiwygSection>

        <WysiwygSection label="SEO — how you appear in Google">
          <SiteSeoEditable siteMeta={siteMeta} onChange={setSiteMeta} />
        </WysiwygSection>

        <p className="text-sm text-black/60">
          Portfolio galleries are edited separately under{' '}
          <Link href="/studio/galleries" className="underline">
            Galleries
          </Link>
          . Use drag-and-drop on the galleries list to set homepage order.
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
