import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { FaTwitter, FaFacebook, FaEnvelope } from 'react-icons/fa';

export const metadata = {
  title: 'What is a Cyanotype?',
  description: 'Learn about the historic cyanotype photographic process and how it creates beautiful blue prints.',
  openGraph: {
    title: 'What is a Cyanotype?',
    description: 'Learn about the historic cyanotype photographic process and how it creates beautiful blue prints.',
    url: 'https://corywoodall.com/articles/what-is-a-cyanotype',
    type: 'article',
    images: [
      {
        url: 'https://corywoodall.com/images/cyanotype-og.jpg',
        width: 1200,
        height: 630,
        alt: 'What is a Cyanotype?',
      },
    ],
  },
};

export default function CyanotypePage() {
  const data = {
    title: 'What is a Cyanotype?',
    date: '2024-01-15',
    slug: 'what-is-a-cyanotype'
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
            <span>4 min read</span>
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
          <p className="text-lg text-black/80 leading-relaxed tracking-wide mb-4">The medium of cyanotype is a photographic one, created with a careful mixture of light-sensitive chemicals coated onto a support surface and exposed to ultraviolet light, leaving behind areas of light and dark—shadows, essentially. This shadow-fixing process is the basis of all non-digital photography since its invention in 1839. The major difference between the numerous ways of making photographic prints is the materials involved that make a surface light-sensitive with the ability to capture and preserve impressions of light and shadow. Cyanotype emulsion (a liquid) uses a combination of water and chemicals that are available commercially today and can be applied to a variety of support surfaces, including paper, fabric, and ceramic.</p>

          <h2 className="text-3xl font-bold text-black mb-4 mt-8 tracking-wide">Photograms vs. Negatives</h2>

          <p className="text-lg text-black/80 leading-relaxed tracking-wide mb-4">A cyanotype can be made with a negative (procured via cameras either digitally or on film) to produce a positive print, or by placing objects directly onto the sensitized support surface. The latter is referred to as a "photogram" and is the type of work I typically make.</p>

          <div className="my-8 flex justify-center">
            <img
              src="/images/portfolio/Herbaria/Evening Primrose group.jpg"
              alt="Evening Primrose cyanotype photogram showing direct object placement"
              className="rounded-lg shadow-lg w-80 h-auto"
            />
          </div>

          <h2 className="text-3xl font-bold text-black mb-4 mt-8 tracking-wide">The Process</h2>

          <p className="text-lg text-black/80 leading-relaxed tracking-wide mb-4">Cyanotype paper begins to develop as soon as it encounters sunlight (or artificial UV light), so the emulsion coating, drying, and arrangement of the subject material (negatives or objects) takes place in dark interiors. I frequently treat my papers at night and leave them to dry before scrambling to store them in a light-proof box in the morning.</p>

          <p className="text-lg text-black/80 leading-relaxed tracking-wide mb-4">When the composition is satisfactory, the support surface and the subject material are moved into sunlight to be exposed. In high UV areas like Flagstaff, the exposure time can take less than 3 minutes, whereas lower UV climates will need half an hour or longer to achieve their desired results. UV lamps can alternatively be used and make for an excellent substitute in winter.</p>

          <div className="my-8 flex justify-center">
            <img
              src="/images/portfolio/Herbaria/Blackberry May 2023.jpg"
              alt="Blackberry cyanotype showing the exposure and development process"
              className="rounded-lg shadow-lg w-80 h-auto"
            />
          </div>

          <h2 className="text-3xl font-bold text-black mb-4 mt-8 tracking-wide">Development & Drying</h2>

          <p className="text-lg text-black/80 leading-relaxed tracking-wide mb-4">Finally, the cyanotype is moved back indoors and out of the UV light, halting the exposure. The subject material is removed, and the support surface is rinsed with water. The rinsing will reveal a blue and white image within minutes. The support surface is then left to dry, and the process is complete.</p>

          <p className="text-lg text-black/80 leading-relaxed tracking-wide mb-4">I like to dry my works on paper flat on my cement floor, and I find that the natural water tension of the wet print helps it lay flat during the drying process, resulting in a relatively flat finished product. Works on fabric typically get draped on coat hangers over my bathtub.</p>

          <div className="my-8 flex justify-center">
            <img
              src="/images/portfolio/Herbaria/Paperwhites April 25cw.jpg"
              alt="Paperwhites cyanotype showing the final dried result"
              className="rounded-lg shadow-lg w-80 h-auto"
            />
          </div>

          <h2 className="text-3xl font-bold text-black mb-4 mt-8 tracking-wide">Care & Preservation</h2>

          <p className="text-lg text-black/80 leading-relaxed tracking-wide mb-4">Like most photographic works, cyanotype prints are moderately light-stable. If exposed to direct sunlight over years, the imagery will eventually fade. This ephemeral quality of the cyanotype makes it even more precious in the years they are at their most vibrant. To extend the life of your cyanotypes, consider rotating their display every 6 months to allow works to "rest" in a dark place.</p>

          <div className="my-8 flex justify-center">
            <img
              src="/images/portfolio/Herbaria/Sapling 2022 blue CLEAN WHITE.jpg"
              alt="Sapling cyanotype showing the characteristic blue and white tones"
              className="rounded-lg shadow-lg w-80 h-auto"
            />
          </div>
        </div>
      </article>

      {/* Article Navigation */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <a 
              href="/articles/arizona-state-parks-artist-residency-2025" 
              className="group flex items-center text-gray-600 hover:text-black transition-colors"
            >
              <div className="mr-4">
                <div className="text-sm text-gray-500 group-hover:text-gray-700">Previous Article</div>
                <div className="font-medium group-hover:underline">Arizona State Parks Artist Residency</div>
              </div>
              <div className="text-gray-400 group-hover:text-gray-600">←</div>
            </a>
          </div>
          <div className="flex-1 text-right">
            <div className="text-sm text-gray-500">No next article yet</div>
          </div>
        </div>
      </div>
    </div>
  );
}