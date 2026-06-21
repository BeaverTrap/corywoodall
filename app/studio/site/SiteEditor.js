'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { defaultHomeContent, defaultArticlesIndexContent, defaultSiteMeta } from '@/lib/content/staticSite';
import { uploadStudioImage } from '@/lib/uploads/client';

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
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (initialSections?.home) setHome(initialSections.home);
    if (initialSections?.articles_index) setArticlesIndex(initialSections.articles_index);
    if (initialSections?.site_meta) setSiteMeta(initialSections.site_meta);
  }, [initialSections]);

  const saveAll = async () => {
    setSaving(true);
    setMessage('');

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
      return;
    }

    setMessage('Site content saved. Changes are live on the public site.');
  };

  const uploadBackground = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const publicUrl = await uploadStudioImage(file, 'site');

      setHome((prev) => ({
        ...prev,
        hero: { ...prev.hero, backgroundImage: publicUrl },
      }));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Image upload failed.');
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
    <div className="max-w-4xl space-y-8 pb-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/studio" className="text-sm text-black/60 hover:underline">
            ← Back to dashboard
          </Link>
          <h2 className="text-3xl font-bold mt-2">Edit site content</h2>
          <p className="text-black/70 mt-1">
            Hero, about, contact, FAQ, articles page, and SEO text for the public site.
          </p>
        </div>
        <button
          type="button"
          onClick={saveAll}
          disabled={saving}
          className="px-5 py-2.5 rounded-lg bg-black text-white disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save all changes'}
        </button>
      </div>

      {message && <p className="text-sm text-black/70">{message}</p>}

      <section id="hero" className="bg-white border border-black/10 rounded-lg p-6 space-y-4">
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
          onChange={(e) => setHome((prev) => ({ ...prev, hero: { ...prev.hero, subtitle: e.target.value } }))}
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
          <input
            className="w-full border border-black/20 rounded px-3 py-2"
            value={home.hero.backgroundImage}
            onChange={(e) =>
              setHome((prev) => ({ ...prev, hero: { ...prev.hero, backgroundImage: e.target.value } }))
            }
            placeholder="Background image URL"
          />
          <label className="inline-block px-3 py-2 border rounded cursor-pointer text-sm">
            Upload new background
            <input type="file" accept="image/*" className="hidden" onChange={uploadBackground} />
          </label>
        </div>
      </section>

      <section id="about" className="bg-white border border-black/10 rounded-lg p-6 space-y-4">
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
        {home.about.paragraphs.map((paragraph, index) => (
          <div key={`about-${index}`} className="space-y-2">
            <textarea
              rows={4}
              className="w-full border border-black/20 rounded px-3 py-2"
              value={paragraph}
              onChange={(e) => updateParagraph(index, e.target.value)}
            />
            <button
              type="button"
              className="text-sm text-red-700"
              onClick={() =>
                setHome((prev) => ({
                  ...prev,
                  about: {
                    paragraphs: prev.about.paragraphs.filter((_, i) => i !== index),
                  },
                }))
              }
            >
              Remove paragraph
            </button>
          </div>
        ))}
        <p className="text-xs text-black/50">
          You can use simple HTML in paragraphs, e.g. &lt;strong&gt;Cory Woodall&lt;/strong&gt; for bold.
        </p>
      </section>

      <section id="contact" className="bg-white border border-black/10 rounded-lg p-6 space-y-4">
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

      <section id="faq" className="bg-white border border-black/10 rounded-lg p-6 space-y-4">
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
        {home.faq.items.map((item, index) => (
          <div key={`faq-${index}`} className="border border-black/10 rounded p-4 space-y-3">
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
            <div className="flex gap-2">
              <button
                type="button"
                className="text-sm px-2 py-1 border rounded"
                disabled={index === 0}
                onClick={() => {
                  const items = [...home.faq.items];
                  [items[index - 1], items[index]] = [items[index], items[index - 1]];
                  setHome((prev) => ({ ...prev, faq: { ...prev.faq, items } }));
                }}
              >
                Move up
              </button>
              <button
                type="button"
                className="text-sm px-2 py-1 border rounded"
                disabled={index === home.faq.items.length - 1}
                onClick={() => {
                  const items = [...home.faq.items];
                  [items[index], items[index + 1]] = [items[index + 1], items[index]];
                  setHome((prev) => ({ ...prev, faq: { ...prev.faq, items } }));
                }}
              >
                Move down
              </button>
              <button
                type="button"
                className="text-sm text-red-700"
                onClick={() =>
                  setHome((prev) => ({
                    ...prev,
                    faq: {
                      ...prev.faq,
                      items: prev.faq.items.filter((_, i) => i !== index),
                    },
                  }))
                }
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </section>

      <section className="bg-white border border-black/10 rounded-lg p-6 space-y-4">
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

      <section className="bg-white border border-black/10 rounded-lg p-6 space-y-4">
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

      <p className="text-sm text-black/60">
        Portfolio galleries are edited separately under{' '}
        <Link href="/studio/galleries" className="underline">
          Galleries
        </Link>
        . Publish a gallery there to replace the default homepage portfolio.
      </p>
    </div>
  );
}
