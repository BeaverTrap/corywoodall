import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata = {
  title: 'What is a Cyanotype?',
  description: 'Learn about the historic cyanotype photographic process and how it creates beautiful blue prints.',
  openGraph: {
    title: 'What is a Cyanotype?',
    description: 'Learn about the historic cyanotype photographic process and how it creates beautiful blue prints.',
    type: 'article',
    publishedTime: '2024-01-15',
  },
};

export default function CyanotypePage() {
  const data = {
    title: 'What is a Cyanotype?',
    date: '2024-01-15',
    slug: 'what-is-a-cyanotype'
  };

  const content = `A **cyanotype** is a photographic printing process that produces a cyan-blue print. The process was invented by Sir John Herschel in 1842 and was one of the first non-silver photographic processes.

## How It Works

The cyanotype process uses two chemicals:
- **Ferric ammonium citrate** (light-sensitive)
- **Potassium ferricyanide** (developing agent)

When these chemicals are mixed and applied to paper, they create a light-sensitive surface. When exposed to UV light (sunlight), the ferric ammonium citrate reduces to ferrous form, which then reacts with potassium ferricyanide to form the insoluble pigment **Prussian blue**.

## The Process

1. **Coating**: The paper is coated with the light-sensitive solution
2. **Drying**: The paper is dried in darkness
3. **Exposure**: Objects or negatives are placed on the paper and exposed to UV light
4. **Development**: The paper is rinsed in water to remove unexposed chemicals
5. **Drying**: The final print is dried

## Characteristics

- **Color**: Distinctive cyan-blue color
- **Tone**: High contrast, with deep blues and whites
- **Durability**: Very stable and archival
- **Texture**: Can be applied to various surfaces

## Historical Significance

Cyanotypes were widely used for:
- **Blueprints** for architectural and engineering drawings
- **Scientific documentation** of botanical specimens
- **Artistic expression** by photographers like Anna Atkins

## Modern Applications

Today, cyanotypes are used by:
- **Artists** for alternative photography
- **Educators** teaching photographic history
- **Crafters** for decorative and artistic purposes

The process remains popular due to its simplicity, beautiful results, and connection to photographic history.`;

  // Social share URLs
  const pageUrl = `https://yourdomain.com/articles/${data.slug}`;
  const shareText = encodeURIComponent(data.title || '');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article className="prose prose-lg max-w-none">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{data.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <time dateTime={data.date}>
              {new Date(data.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </time>
            <span>4 min read</span>
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ 
            __html: content
              .replace(/^# (.*$)/gim, '<h1>$1</h1>')
              .replace(/^## (.*$)/gim, '<h2>$1</h2>')
              .replace(/^### (.*$)/gim, '<h3>$1</h3>')
              .replace(/^\*\*(.*)\*\*/gim, '<strong>$1</strong>')
              .replace(/^\* (.*$)/gim, '<li>$1</li>')
              .replace(/^- (.*$)/gim, '<li>$1</li>')
              .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
              .replace(/\n\n/g, '</p><p>')
              .replace(/^(?!<[h|l])/gm, '<p>')
              .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
              .replace(/<\/ul><ul>/g, '')
              .replace(/<p><\/p>/g, '')
          }} />
        </div>

        <footer className="mt-12 pt-8 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
            <div className="flex gap-4">
              <a 
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                Share on Twitter
              </a>
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                Share on Facebook
              </a>
              <a 
                href={`mailto:?subject=${shareText}&body=${encodeURIComponent(pageUrl)}`}
                className="text-blue-600 hover:text-blue-800"
              >
                Share via Email
              </a>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}