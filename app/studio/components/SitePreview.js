'use client';

import Image from 'next/image';

function renderAboutParagraph(paragraph, index) {
  const className = 'text-sm leading-relaxed tracking-wide';
  if (paragraph.includes('<')) {
    return (
      <p
        key={`about-${index}`}
        className={className}
        dangerouslySetInnerHTML={{ __html: paragraph }}
      />
    );
  }
  return (
    <p key={`about-${index}`} className={className}>
      {paragraph}
    </p>
  );
}

export default function SitePreview({ home, articlesIndex, siteMeta }) {
  const { hero, about, contact, faq } = home;

  return (
    <div className="bg-stone-200 text-black">
      <section className="relative min-h-[320px] flex items-center justify-center overflow-hidden">
        {hero.backgroundImage ? (
          <Image
            src={hero.backgroundImage}
            alt=""
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-700" />
        )}
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center px-4 py-10">
          <h1 className="text-3xl font-black text-white mb-4 tracking-[0.1em]">
            {hero.name || 'Hero name'}
          </h1>
          <div className="backdrop-blur-md bg-white/50 p-4 rounded-lg max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-2">{hero.subtitle || 'Subtitle'}</h2>
            <p className="text-sm leading-relaxed">{hero.tagline || 'Tagline'}</p>
          </div>
        </div>
      </section>

      <section className="p-4">
        <div className="backdrop-blur-md bg-white/70 p-4 rounded-lg space-y-3">
          {(about.paragraphs || []).map(renderAboutParagraph)}
        </div>
      </section>

      <section className="p-4">
        <div className="backdrop-blur-md bg-white/70 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-2">{contact.heading || 'Contact'}</h3>
          <p className="text-sm mb-2">{contact.intro}</p>
          <p className="text-sm">{contact.email}</p>
          <p className="text-sm text-black/70">{contact.location}</p>
        </div>
      </section>

      <section className="p-4">
        <div className="backdrop-blur-md bg-white/70 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-4">{faq.title || 'FAQ'}</h3>
          <div className="space-y-4">
            {(faq.items || []).map((item, index) => (
              <div key={`faq-${index}`} className="border-b border-black/10 pb-3 last:border-0">
                <p className="font-semibold text-sm mb-1">{item.question || 'Question'}</p>
                <p className="text-sm text-black/80">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="p-4 border-t border-black/10 bg-white/80">
        <p className="text-xs uppercase tracking-[0.2em] text-black/50 mb-2">Articles page</p>
        <h3 className="text-lg font-bold">{articlesIndex.title}</h3>
        <p className="text-sm text-black/70 mt-1">{articlesIndex.intro}</p>
      </section>

      <section className="p-4 bg-black text-white text-xs">
        <p className="text-white/60 mb-1">SEO preview</p>
        <p className="font-medium">{siteMeta.title}</p>
        <p className="text-white/70 mt-1">{siteMeta.description}</p>
      </section>
    </div>
  );
}
