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

              <p className="text-lg text-black/80 leading-relaxed tracking-wide mb-4">Flagstaff-based artist <strong>Cory Woodall</strong> has been selected for the <strong>Arizona State Parks Artist Residency Program</strong>, hosted at <strong>Patagonia Lake State Park</strong> and presented in collaboration with <strong>Arizona State Parks and Trails</strong> and the <strong>Arizona Commission on the Arts</strong>, with support from the <strong>Arizona Community Foundation</strong>.</p>

              <p className="text-lg text-black/80 leading-relaxed tracking-wide mb-4">During the three-week residency, Woodall will continue her exploration of the historic <strong>cyanotype</strong> process—a form of photographic printmaking that merges hand-coated papers, light-sensitive chemistry, and ethically sourced botanical specimens. Her work takes an imaginative divergence in the tradition of botanical studies, creating images of ethereal luminosity inspired by the forms and light of the natural world.</p>

              <div className="text-lg text-black/80 leading-relaxed tracking-wide mb-4">
                <p><strong>Official announcement:</strong> <a href="https://azarts.gov/news/artists-selected-for-state-park-artist-residency-program/" className="text-blue-600 hover:text-blue-800 underline">Artists Selected for State Park Artist Residency Program →</a></p>
                <p><strong>Instagram announcement:</strong> <a href="https://www.instagram.com/p/DQHp9xDjqa9/?utm_source=ig_web_copy_link" className="text-blue-600 hover:text-blue-800 underline">Arizona State Parks post →</a></p>
              </div>

              <hr className="my-8 border-black/20" />

              <h2 className="text-3xl font-bold text-black mb-4 mt-8 tracking-wide">What to Expect</h2>

              <p className="text-lg text-black/80 leading-relaxed tracking-wide mb-4">While updates during the residency may be limited, new works and reflections from the experience will be shared after November 16.</p>

              <p className="text-lg text-black/80 leading-relaxed tracking-wide mb-4">Planned post-residency updates include:</p>

              <ul className="list-disc list-inside text-lg text-black/80 leading-relaxed tracking-wide mb-4 space-y-2">
                <li>A gallery of cyanotypes created on site</li>
                <li>Notes on process, materials, and plant selection</li>
                <li>Insights into what's next for this evolving body of work</li>
              </ul>

              <hr className="my-8 border-black/20" />

              <h2 className="text-3xl font-bold text-black mb-4 mt-8 tracking-wide">About the Program</h2>

              <p className="text-lg text-black/80 leading-relaxed tracking-wide mb-4">The State Parks Artist Residency places artists within Arizona's inspiring natural landscapes, offering on-site housing, workspace, and opportunities for open studios and public engagement at the park.</p>

              <p className="text-lg text-black/80 leading-relaxed tracking-wide mb-4"><strong>Program Partners:</strong> @azstateparks, @azartscomm, @theazfoundation</p>

              <hr className="my-8 border-black/20" />

              <h2 className="text-3xl font-bold text-black mb-4 mt-8 tracking-wide">Follow-up & Updates</h2>

              <p className="text-lg text-black/80 leading-relaxed tracking-wide mb-4">Post-residency updates will be shared through dedicated <strong>journal entries</strong> in the articles section and accompanying <strong>galleries</strong> in the portfolio section, documenting the Patagonia Lake cyanotype series and residency experience.</p>
            </div>
          </article>

      {/* Article Navigation */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <a 
              href="/articles/what-is-a-cyanotype" 
              className="group flex items-center text-gray-600 hover:text-black transition-colors"
            >
              <div className="mr-4">
                <div className="text-sm text-gray-500 group-hover:text-gray-700">Previous Article</div>
                <div className="font-medium group-hover:underline">What is a Cyanotype?</div>
              </div>
              <div className="text-gray-400 group-hover:text-gray-600">←</div>
            </a>
          </div>
          <div className="flex-1 text-right">
            <a 
              href="/articles/patagonia-lake-residency" 
              className="group flex items-center justify-end text-gray-600 hover:text-black transition-colors"
            >
              <div className="text-gray-400 group-hover:text-gray-600">→</div>
              <div className="ml-4">
                <div className="text-sm text-gray-500 group-hover:text-gray-700">Next Article</div>
                <div className="font-medium group-hover:underline">Patagonia Lake Residency</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}