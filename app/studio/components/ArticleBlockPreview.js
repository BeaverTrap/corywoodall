'use client';

import Image from 'next/image';
import ImageGridWithCaptions from '@/app/components/ImageGridWithCaptions';
import ImageWithCaption from '@/app/components/ImageWithCaption';

export function ArticleHeaderPreview({ article }) {
  return (
    <div className="p-6 h-full flex flex-col justify-center">
      <h1 className="text-2xl font-bold mb-2">{article.title || 'Article title'}</h1>
      {article.excerpt ? <p className="text-black/70 text-sm">{article.excerpt}</p> : null}
    </div>
  );
}

export default function ArticleBlockPreview({ block }) {
  if (!block) return null;

  switch (block.block_type) {
    case 'heading': {
      const Tag = block.content?.level === 3 ? 'h3' : 'h2';
      return (
        <div className="p-4 h-full flex items-center">
          <Tag className="text-xl font-bold">{block.content?.text || 'Heading'}</Tag>
        </div>
      );
    }
    case 'text': {
      const body = block.content?.body || '';
      return (
        <div className="p-4 h-full cms-rich-text text-sm leading-relaxed">
          {body.includes('<') ? (
            <div dangerouslySetInnerHTML={{ __html: body }} />
          ) : (
            <p className="whitespace-pre-line">{body}</p>
          )}
        </div>
      );
    }
    case 'image':
      return block.content?.src ? (
        <div className="p-4">
          <ImageWithCaption
            src={block.content.src}
            alt={block.content.alt || ''}
            caption={block.content.caption || block.content.alt || ''}
          />
        </div>
      ) : (
        <p className="p-4 text-sm text-black/50">Upload an image for this block.</p>
      );
    case 'image_grid':
      return (
        <div className="p-4">
          <ImageGridWithCaptions
            images={(block.content?.images || []).filter((img) => img.src)}
            cols={block.content?.cols || 3}
            caption={block.content?.caption || ''}
          />
        </div>
      );
    default:
      return null;
  }
}
