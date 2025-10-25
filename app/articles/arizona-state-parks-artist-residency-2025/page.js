import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata = {
  title: 'Cory Woodall Selected for Arizona State Parks Artist Residency',
  description: 'I\'m honored to be selected for the Arizona State Parks Artist Residency Program, hosted at Patagonia Lake State Park.',
  openGraph: {
    title: 'Cory Woodall Selected for Arizona State Parks Artist Residency',
    description: 'I\'m honored to be selected for the Arizona State Parks Artist Residency Program, hosted at Patagonia Lake State Park.',
    type: 'article',
    publishedTime: '2025-10-24',
  },
};

export default function ArizonaStateParksResidency() {
  const data = {
    title: 'Cory Woodall Selected for Arizona State Parks Artist Residency',
    date: '2025-10-24',
    slug: 'arizona-state-parks-artist-residency-2025'
  };

  const content = `# Artist in Residence: Patagonia Lake State Park (Oct 29–Nov 16, 2025)

I'm honored to be selected for the **Arizona State Parks Artist Residency Program**, hosted at **Patagonia Lake State Park** and presented in collaboration with **Arizona State Parks and Trails** and the **Arizona Commission on the Arts**, with support from the **Arizona Community Foundation**.

My work during the residency will continue my exploration of historic **cyanotype** printmaking—hand-coated papers, light-sensitive chemistry, and ethically sourced botanical specimens arranged to study form and luminous contrast.

> "I'm interested in how light maps the structure of plants—quiet, ethereal impressions that sit between drawing and photography."

- Official announcement from the Arizona Commission on the Arts → [**Read the article**](https://azarts.gov/news/artists-selected-for-state-park-artist-residency-program/)
- Residency announcement on Arizona State Parks' Instagram → [**See the post**](https://www.instagram.com/p/DQHp9xDjqa9/?utm_source=ig_web_copy_link)

## What to Expect

While I may post sparingly **during** the residency, I'll publish a fuller update **after** Nov 16 with:

- A gallery of new cyanotypes created on site
- Notes on process, materials, and plant selection
- Next steps for this body of work (exhibits, editions, and prints)

## Program Notes

The State Parks Artist Residency places artists inside Arizona's landscapes with on-site housing, workspace, and opportunities for open studios and public engagement at the park.

**Partners:** @azstateparks, @azartscomm, @theazfoundation

---

## Follow-up & Updates

Subscribe or check back here; this page will serve as the **central hub** for post-residency images, write-ups, and announcements.`;

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
            <span>3 min read</span>
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <div className="whitespace-pre-line">{content}</div>
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