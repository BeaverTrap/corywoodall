import ImageWithCaption from './ImageWithCaption';
import ImageGridWithCaptions from './ImageGridWithCaptions';
import { CmsRichText } from './CmsRichText';
function renderTextBlock(block) {
  const body = block.content?.body || '';
  const className = 'cms-rich-text text-lg leading-relaxed tracking-wide';

  if (body.includes('<')) {
    return (
      <div
        key={block.id}
        className={className}
        dangerouslySetInnerHTML={{ __html: body }}
      />
    );
  }

  return (
    <p key={block.id} className={`${className} whitespace-pre-line`}>
      {body}
    </p>
  );
}

export default function ArticleContent({ blocks }) {
  return (
    <div className="space-y-6">
      {(blocks || []).map((block) => {
        switch (block.block_type) {
          case 'heading': {
            const Tag = block.content?.level === 3 ? 'h3' : 'h2';
            return (
              <CmsRichText
                key={block.id}
                as={Tag}
                className="text-2xl font-bold mt-8 mb-4"
                value={block.content?.text}
              />
            );
          }
          case 'text':
            return renderTextBlock(block);
          case 'image':
            return block.content?.src ? (
              <ImageWithCaption
                key={block.id}
                src={block.content.src}
                alt={block.content.alt || ''}
                caption={block.content.caption || block.content.alt || ''}
              />
            ) : null;
          case 'image_grid':
            return (
              <ImageGridWithCaptions
                key={block.id}
                images={(block.content?.images || []).filter((img) => img.src)}
                cols={block.content?.cols || 3}
                caption={block.content?.caption || ''}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
