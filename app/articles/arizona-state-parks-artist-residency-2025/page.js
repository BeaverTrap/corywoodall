import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { FaTwitter, FaFacebook, FaEnvelope } from 'react-icons/fa';

export const metadata = {
  title: 'Cory Woodall Selected for Arizona State Parks Artist Residency',
  description: 'I\'m honored to be selected for the Arizona State Parks Artist Residency Program, hosted at Patagonia Lake State Park.',
  openGraph: {
    title: 'Cory Woodall Selected for Arizona State Parks Artist Residency',
    description: 'I\'m honored to be selected for the Arizona State Parks Artist Residency Program, hosted at Patagonia Lake State Park.',
    url: 'https://corywoodall.com/articles/arizona-state-parks-artist-residency-2025',
    type: 'article',
    images: [
      {
        url: 'https://corywoodall.com/images/arizona-state-parks-residency-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Cory Woodall at Patagonia Lake State Park',
      },
    ],
  },
};

export default function ArizonaStateParksResidency() {
  const data = {
    title: 'Cory Woodall Selected for Arizona State Parks Artist Residency',
    date: '2025-10-24',
    slug: 'arizona-state-parks-artist-residency-2025'
  };

  // Social share URLs
  const pageUrl = `https://yourdomain.com/articles/${data.slug}`;
  const shareText = encodeURIComponent(data.title || '');

  return (
    <div className="container mx-auto px-4 max-w-4xl py-8">
      <div className="mb-2">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-4xl font-bold mb-2 sm:mb-0 text-left">{data.title}</h1>
          <div className="text-sm text-black/60 text-right">
            <span>{new Date(data.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
            <span className="mx-2">·</span>
            <span>3 min read</span>
          </div>
        </div>
      </div>

      {/* Social share bar: icon-only, right-aligned */}
      <div className="flex justify-end mb-8">
        <div className="flex gap-2">
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/80 shadow hover:bg-black/90 hover:text-white transition-colors text-black/70 text-lg"
            title="Share on Twitter"
          >
            <FaTwitter />
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/80 shadow hover:bg-black/90 hover:text-white transition-colors text-black/70 text-lg"
            title="Share on Facebook"
          >
            <FaFacebook />
          </a>
          <a
            href={`mailto:?subject=${shareText}&body=${encodeURIComponent(pageUrl)}`}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/80 shadow hover:bg-black/90 hover:text-white transition-colors text-black/70 text-lg"
            title="Share via Email"
          >
            <FaEnvelope />
          </a>
        </div>
      </div>

      <article className="prose prose-lg max-w-none mx-auto">
        <div>
          <h1 className="text-4xl font-bold text-black mb-6 tracking-wide">Artist in Residence: Patagonia Lake State Park (Oct 29–Nov 16, 2025)</h1>

          <p className="text-lg text-black/80 leading-relaxed tracking-wide mb-4">I'm honored to be selected for the <strong>Arizona State Parks Artist Residency Program</strong>, hosted at <strong>Patagonia Lake State Park</strong> and presented in collaboration with <strong>Arizona State Parks and Trails</strong> and the <strong>Arizona Commission on the Arts</strong>, with support from the <strong>Arizona Community Foundation</strong>.</p>

          <p className="text-lg text-black/80 leading-relaxed tracking-wide mb-4">My work during the residency will continue my exploration of historic <strong>cyanotype</strong> printmaking—hand-coated papers, light-sensitive chemistry, and ethically sourced botanical specimens arranged to study form and luminous contrast.</p>

          <blockquote className="border-l-4 border-black/30 pl-6 italic text-lg text-black/70 leading-relaxed tracking-wide mb-4">"I'm interested in how light maps the structure of plants—quiet, ethereal impressions that sit between drawing and photography."</blockquote>

          <ul className="list-disc list-inside text-lg text-black/80 leading-relaxed tracking-wide mb-4 space-y-2">
            <li>Official announcement from the Arizona Commission on the Arts → <a href="https://azarts.gov/news/artists-selected-for-state-park-artist-residency-program/" className="text-blue-600 hover:text-blue-800 underline"><strong>Read the article</strong></a></li>
            <li>Residency announcement on Arizona State Parks' Instagram → <a href="https://www.instagram.com/p/DQHp9xDjqa9/?utm_source=ig_web_copy_link" className="text-blue-600 hover:text-blue-800 underline"><strong>See the post</strong></a></li>
          </ul>

          <h2 className="text-3xl font-bold text-black mb-4 mt-8 tracking-wide">What to Expect</h2>

          <p className="text-lg text-black/80 leading-relaxed tracking-wide mb-4">While I may post sparingly <strong>during</strong> the residency, I'll publish a fuller update <strong>after</strong> Nov 16 with:</p>

          <ul className="list-disc list-inside text-lg text-black/80 leading-relaxed tracking-wide mb-4 space-y-2">
            <li>A gallery of new cyanotypes created on site</li>
            <li>Notes on process, materials, and plant selection</li>
            <li>Next steps for this body of work (exhibits, editions, and prints)</li>
          </ul>

          <h2 className="text-3xl font-bold text-black mb-4 mt-8 tracking-wide">Program Notes</h2>

          <p className="text-lg text-black/80 leading-relaxed tracking-wide mb-4">The State Parks Artist Residency places artists inside Arizona's landscapes with on-site housing, workspace, and opportunities for open studios and public engagement at the park.</p>

          <p className="text-lg text-black/80 leading-relaxed tracking-wide mb-4"><strong>Partners:</strong> @azstateparks, @azartscomm, @theazfoundation</p>

          <hr className="my-8 border-black/20" />

          <h2 className="text-3xl font-bold text-black mb-4 mt-8 tracking-wide">Follow-up & Updates</h2>

          <p className="text-lg text-black/80 leading-relaxed tracking-wide mb-4">Subscribe or check back here; this page will serve as the <strong>central hub</strong> for post-residency images, write-ups, and announcements.</p>
        </div>
      </article>
    </div>
  );
}