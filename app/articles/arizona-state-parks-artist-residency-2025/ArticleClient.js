"use client";
import { useState } from 'react';
import MDXContent from '../../components/MDXContent';
import Link from 'next/link';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import { FaTwitter, FaFacebook, FaEnvelope } from 'react-icons/fa';

export default function ArticleClient({ data, mdxSource, readingTime, prev, next, images, shareLinks }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Handler to open lightbox when an image is clicked
  function handleImageClick(e) {
    if (e.target.tagName === 'IMG') {
      const idx = images.findIndex(img => img.src === e.target.src || e.target.getAttribute('src')?.endsWith(img.src));
      if (idx !== -1) {
        e.preventDefault();
        setLightboxIndex(idx);
        setLightboxOpen(true);
      }
    }
  }

  return (
    <div onClick={handleImageClick}>
      <div className="mb-2">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-4xl font-bold mb-2 sm:mb-0 text-left">{data.title}</h1>
          <div className="text-sm text-black/60 text-right">
            <span>{data.date}</span>
            <span className="mx-2">·</span>
            <span>{readingTime} min read</span>
          </div>
        </div>
      </div>
      {/* Social share bar: icon-only, right-aligned */}
      <div className="flex justify-end mb-8">
        <div className="flex gap-2">
          {shareLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white/80 shadow hover:bg-black/90 hover:text-white transition-colors text-black/70 text-lg"
              style={{ minWidth: 0 }}
              title={`Share on ${link.label}`}
            >
              {link.label === 'Twitter' && <FaTwitter />}
              {link.label === 'Facebook' && <FaFacebook />}
              {link.label === 'Email' && <FaEnvelope />}
            </a>
          ))}
        </div>
      </div>
      {data.summary && (
        <div className="text-lg text-black/80 mb-4 text-center">{data.summary}</div>
      )}
      <article className="prose prose-lg max-w-none mx-auto">
        <MDXContent source={mdxSource} />
      </article>
      {/* Lightbox for article images */}
      {images.length > 0 && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides={images.map(img => ({ src: img.src }))}
          plugins={[Zoom]}
        />
      )}
      {/* Bottom navigation: next/previous with article titles, centered and subtle */}
      <div className="mt-12 flex justify-center gap-8 text-black/60 text-sm">
        {prev && (
          <Link href={`/articles/${prev.slug}`} className="hover:underline">
            ← Previous: {prev.title}
          </Link>
        )}
        {next && (
          <Link href={`/articles/${next.slug}`} className="hover:underline">
            Next: {next.title} →
          </Link>
        )}
      </div>
    </div>
  );
} 