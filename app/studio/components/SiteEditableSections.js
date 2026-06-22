'use client';

import Image from 'next/image';
import ImageUploadButton from '@/app/studio/components/ImageUploadButton';
import RichTextarea from '@/app/studio/components/RichTextarea';
import SortableList from '@/app/studio/components/SortableList';
import ReorderControls from '@/app/studio/components/ReorderControls';
import { presetHint } from '@/lib/uploads/presets';

export function SiteHeroEditable({ hero, onChange, onUploadBackground, uploading }) {
  const update = (field, value) => onChange({ ...hero, [field]: value });

  return (
    <div className="bg-stone-200 text-black">
      <div className="relative min-h-[300px] flex items-center justify-center overflow-hidden">
        {hero.backgroundImage ? (
          <Image src={hero.backgroundImage} alt="" fill className="object-cover" unoptimized />
        ) : (
          <div className="absolute inset-0 bg-neutral-700" />
        )}
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center px-4 py-10 w-full max-w-2xl">
          <div className="mb-4 [&_.studio-toolbar]:bg-white/15 [&_.studio-toolbar-btn]:text-white [&_.studio-toolbar-btn:hover]:bg-white/20 [&_.studio-toolbar-btn-active]:bg-white/25 [&_.studio-toolbar-btn-active]:text-white [&_.studio-rich-text]:text-white [&_.ProseMirror]:text-white">
            <RichTextarea
              rows={1}
              variant="hero-title"
              toolbar="minimal"
              singleLine
              bordered={false}
              value={hero.name}
              onChange={(value) => update('name', value)}
              placeholder="Your name"
            />
          </div>
          <div className="backdrop-blur-md bg-white/50 p-4 rounded-lg max-w-md mx-auto space-y-3">
            <RichTextarea
              rows={1}
              variant="hero-subtitle"
              toolbar="minimal"
              singleLine
              bordered={false}
              value={hero.subtitle}
              onChange={(value) => update('subtitle', value)}
              placeholder="Subtitle"
            />
            <RichTextarea
              rows={2}
              variant="hero-tagline"
              toolbar="inline"
              bordered={false}
              value={hero.tagline}
              onChange={(value) => update('tagline', value)}
              placeholder="Tagline"
            />
          </div>
        </div>
      </div>
      <div className="px-4 py-4 space-y-3 border-t border-black/10 bg-white">
        <p className="text-xs font-medium uppercase tracking-wide text-black/45">Hero background</p>
        {hero.backgroundImage ? (
          <img src={hero.backgroundImage} alt="" className="max-h-32 rounded border border-black/10 object-cover" />
        ) : null}
        <div className="flex flex-wrap items-center gap-3">
          <ImageUploadButton
            label={uploading ? 'Uploading...' : 'Upload background'}
            onChange={onUploadBackground}
            disabled={uploading}
          />
          <span className="text-xs text-black/50">or paste URL</span>
        </div>
        <p className="text-xs text-black/50">{presetHint('hero')}</p>
        <input
          className="w-full border border-black/15 rounded px-3 py-2 text-sm"
          value={hero.backgroundImage || ''}
          onChange={(event) => update('backgroundImage', event.target.value)}
          placeholder="https://res.cloudinary.com/..."
        />
      </div>
    </div>
  );
}

export function SiteAboutEditable({ paragraphs, onChange, onAdd, onReorder, onRemove }) {
  return (
    <div className="bg-stone-200 p-4">
      <div className="backdrop-blur-md bg-white/70 p-4 rounded-lg space-y-4">
        <SortableList
          items={paragraphs}
          onReorder={onReorder}
          getItemKey={(_, index) => `about-${index}`}
          renderItem={(paragraph, index, { dragHandleProps }) => (
            <div className="space-y-2">
              <RichTextarea
                rows={4}
                variant="default"
                bordered={false}
                value={paragraph}
                onChange={(value) => {
                  const next = [...paragraphs];
                  next[index] = value;
                  onChange(next);
                }}
                placeholder="About paragraph"
              />
              <ReorderControls
                dragHandleProps={dragHandleProps}
                onRemove={() => onRemove(index)}
                removeLabel="Remove paragraph"
              />
            </div>
          )}
        />
        <button type="button" className="text-sm px-3 py-1.5 border border-black/20 rounded" onClick={onAdd}>
          + Add paragraph
        </button>
      </div>
    </div>
  );
}

export function SiteContactEditable({ contact, onChange }) {
  const update = (field, value) => onChange({ ...contact, [field]: value });

  return (
    <div className="bg-stone-200 p-4">
      <div className="backdrop-blur-md bg-white/70 p-4 rounded-lg space-y-3">
        <RichTextarea
          rows={1}
          variant="contact"
          toolbar="minimal"
          singleLine
          bordered={false}
          value={contact.heading}
          onChange={(value) => update('heading', value)}
          placeholder="Contact heading"
        />
        <RichTextarea
          rows={2}
          variant="contact"
          bordered={false}
          value={contact.intro}
          onChange={(value) => update('intro', value)}
          placeholder="Intro text"
        />
        <input
          className="w-full bg-transparent border-b border-black/15 px-1 py-1 text-sm focus:outline-none focus:border-black/40"
          value={contact.email}
          onChange={(event) => update('email', event.target.value)}
          placeholder="Email address"
        />
        <RichTextarea
          rows={1}
          variant="contact"
          toolbar="minimal"
          singleLine
          bordered={false}
          value={contact.location}
          onChange={(value) => update('location', value)}
          placeholder="Location"
        />
        <RichTextarea
          rows={2}
          variant="compact"
          toolbar="inline"
          bordered={false}
          value={contact.footerNote}
          onChange={(value) => update('footerNote', value)}
          placeholder="Footer note (optional)"
        />
      </div>
    </div>
  );
}

export function SiteFaqEditable({ faq, onChange, onAddItem, onReorderItems, onRemoveItem }) {
  const updateTitle = (value) => onChange({ ...faq, title: value });
  const updateItem = (index, field, value) => {
    const items = [...faq.items];
    items[index] = { ...items[index], [field]: value };
    onChange({ ...faq, items });
  };

  return (
    <div className="bg-stone-200 p-4">
      <div className="backdrop-blur-md bg-white/70 p-4 rounded-lg space-y-4">
        <RichTextarea
          rows={1}
          variant="contact"
          toolbar="minimal"
          singleLine
          bordered={false}
          value={faq.title}
          onChange={updateTitle}
          placeholder="FAQ section title"
        />
        <SortableList
          items={faq.items}
          onReorder={onReorderItems}
          getItemKey={(_, index) => `faq-${index}`}
          renderItem={(item, index, { dragHandleProps }) => (
            <div className="border-b border-black/10 pb-4 last:border-0 space-y-3">
              <RichTextarea
                rows={1}
                variant="contact"
                toolbar="minimal"
                singleLine
                bordered={false}
                value={item.question}
                onChange={(value) => updateItem(index, 'question', value)}
                placeholder="Question"
              />
              <RichTextarea
                rows={3}
                variant="faq"
                bordered={false}
                value={item.answer}
                onChange={(value) => updateItem(index, 'answer', value)}
                placeholder="Answer"
              />
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(item.showArticlesLink)}
                  onChange={(event) => updateItem(index, 'showArticlesLink', event.target.checked)}
                />
                Show link to articles section
              </label>
              <ReorderControls dragHandleProps={dragHandleProps} onRemove={() => onRemoveItem(index)} />
            </div>
          )}
        />
        <button type="button" className="text-sm px-3 py-1.5 border border-black/20 rounded" onClick={onAddItem}>
          + Add question
        </button>
      </div>
    </div>
  );
}

export function SiteArticlesIndexEditable({ articlesIndex, onChange }) {
  const update = (field, value) => onChange({ ...articlesIndex, [field]: value });

  return (
    <div className="bg-stone-100 p-6 min-h-[160px] flex flex-col justify-center space-y-3">
      <RichTextarea
        rows={1}
        variant="article-title"
        toolbar="minimal"
        singleLine
        bordered={false}
        value={articlesIndex.title}
        onChange={(value) => update('title', value)}
        placeholder="Articles page title"
      />
      <RichTextarea
        rows={2}
        variant="article-excerpt"
        bordered={false}
        value={articlesIndex.subtitle}
        onChange={(value) => update('subtitle', value)}
        placeholder="Articles page subtitle"
      />
    </div>
  );
}

export function SiteSeoEditable({ siteMeta, onChange }) {
  const update = (field, value) => onChange({ ...siteMeta, [field]: value });

  return (
    <div className="bg-black text-white p-6 min-h-[140px] flex flex-col justify-center space-y-3 [&_.studio-toolbar]:bg-white/10 [&_.studio-toolbar-btn]:text-white [&_.studio-toolbar-btn:hover]:bg-white/15 [&_.studio-toolbar-btn-active]:bg-white/20 [&_.studio-rich-text]:text-white [&_.ProseMirror]:text-white">
      <p className="text-white/60 text-xs">Search / browser tab</p>
      <RichTextarea
        rows={1}
        variant="compact"
        toolbar="minimal"
        singleLine
        bordered={false}
        value={siteMeta.title}
        onChange={(value) => update('title', value)}
        placeholder="Browser tab title"
      />
      <RichTextarea
        rows={2}
        variant="compact"
        toolbar="inline"
        bordered={false}
        value={siteMeta.description}
        onChange={(value) => update('description', value)}
        placeholder="Meta description"
      />
    </div>
  );
}
