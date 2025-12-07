import { Metadata } from 'next';
import { FaTwitter, FaFacebook, FaEnvelope } from 'react-icons/fa';
import Image from 'next/image';
import ImageWithCaption from '../../components/ImageWithCaption';
import ImageGridWithCaptions from '../../components/ImageGridWithCaptions';

export const metadata = {
  title: 'Reflections on the Patagonia Lake Works',
  description: 'A reflection on the cyanotype works created during the Patagonia Lake residency and the selection process for the portfolio.',
  openGraph: {
    title: 'Reflections on the Patagonia Lake Works',
    description: 'A reflection on the cyanotype works created during the Patagonia Lake residency and the selection process for the portfolio.',
    url: 'https://corywoodall.com/articles/patagonia-lake-works',
    type: 'article',
    images: [
      {
        url: 'https://corywoodall.com/images/portfolio/Patagonia Lake/Spiny Poppy and Hemlock 001.jpg',
        width: 1200,
        height: 630,
        alt: 'Spiny Poppy and Hemlock, 2025',
      },
    ],
  },
};

export default function PatagoniaLakeWorks() {
  const data = {
    title: 'Reflections on the Patagonia Lake Works',
    date: '2025-12-06',
    slug: 'patagonia-lake-works'
  };

  // Social share URLs
  const pageUrl = `https://corywoodall.com/articles/${data.slug}`;
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
            <span>6 min read</span>
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
          <p className="text-lg text-black/80 leading-relaxed tracking-wide mb-6">
            During her three-week residency at Patagonia Lake State Park, Cory Woodall created dozens of cyanotype prints working with the plant life found in this unique environment. From this body of work, nine pieces were selected for the portfolio gallery.
          </p>

          <ImageWithCaption
            src="/images/portfolio/Patagonia Lake/Spiny Poppy and Hemlock 001.jpg"
            alt="Spiny Poppy and Hemlock, 2025"
            caption="Spiny Poppy and Hemlock, 2025"
            isLandscape={false}
          />

          <p className="text-lg text-black/80 leading-relaxed tracking-wide mb-6">
            The selection focuses on works that capture Patagonia Lake's ecosystem—where desert meets water, creating a rich mix of plant life. The pieces range from individual plant studies to compositions showing how different species interact.
          </p>

          <ImageGridWithCaptions
            images={[
              { src: '/images/portfolio/Patagonia Lake/Birdfoot Morning Glory 02.jpg', alt: 'Birdfoot Morning Glory, 2025' },
              { src: '/images/portfolio/Patagonia Lake/Morning Glory and Weed 01.jpg', alt: 'Morning Glory and Weed, 2025' },
              { src: '/images/portfolio/Patagonia Lake/Trailing Four o Clock 01.jpg', alt: 'Trailing Four-o-Clock, 2025' }
            ]}
            cols={3}
            caption="Morning glory variations"
          />

          <p className="text-lg text-black/80 leading-relaxed tracking-wide mb-6">
            The morning glory family appears in three works, showing the variety within a single plant family. Each piece reveals different qualities—how leaves overlap, how vines trail, and the unique patterns each plant creates.
          </p>

          <ImageWithCaption
            src="/images/portfolio/Patagonia Lake/Hemlock 02.jpg"
            alt="Hemlock, 2025"
            caption="Hemlock, 2025"
            isLandscape={false}
          />

          <ImageWithCaption
            src="/images/portfolio/Patagonia Lake/Spiny Poppy and Hemlock 001.jpg"
            alt="Spiny Poppy and Hemlock, 2025"
            caption="Spiny Poppy and Hemlock, 2025"
            isLandscape={false}
          />

          <p className="text-lg text-black/80 leading-relaxed tracking-wide mb-6">
            The Hemlock appears both alone and paired with Spiny Poppy. The composition creates a contrast between the delicate, lacy Hemlock and the bold, spiny Poppy. Most works focused on individual plants, making this pairing one of the few compositions.
          </p>

          <ImageGridWithCaptions
            images={[
              { src: '/images/portfolio/Patagonia Lake/Cucumber.jpg', alt: 'Wild Cucumber, 2025' },
              { src: '/images/portfolio/Patagonia Lake/Mesquite saplings.jpg', alt: 'Mesquite Saplings, 2025' },
              { src: '/images/portfolio/Patagonia Lake/Orange Fantail.jpg', alt: 'Orange Fantails, 2025' }
            ]}
            cols={3}
            caption="Diverse forms from Patagonia Lake"
          />

          <ImageWithCaption
            src="/images/portfolio/Patagonia Lake/Wildflowers at Patagonia Lake.jpg"
            alt="Wildflowers, Patagonia Lake, Fall 2025"
            caption="Wildflowers, Patagonia Lake, Fall 2025"
            isLandscape={false}
          />

          <p className="text-lg text-black/80 leading-relaxed tracking-wide mb-6">
            The final piece, Wildflowers at Patagonia Lake, brings together multiple species in one composition, showing how these plants coexist in the landscape. It's the most complex of the selected works.
          </p>

          <p className="text-lg text-black/80 leading-relaxed tracking-wide mb-6">
            Together, these nine works tell a story about Patagonia Lake's unique environment—a place where desert and water meet, creating remarkable botanical diversity. Each piece stands on its own while contributing to understanding this special place.
          </p>

          <p className="text-lg text-black/80 leading-relaxed tracking-wide mb-6">
            To view the complete Patagonia Lake State Park portfolio, visit the <a href="/#portfolio" className="text-blue-600 hover:text-blue-800 underline">portfolio section</a> of the website.
          </p>
        </div>
      </article>

      {/* Article Navigation */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <a 
              href="/articles/patagonia-lake-residency" 
              className="group flex items-center text-gray-600 hover:text-black transition-colors"
            >
              <div className="mr-4">
                <div className="text-sm text-gray-500 group-hover:text-gray-700">Previous Article</div>
                <div className="font-medium group-hover:underline">Artist in Residence: Patagonia Lake State Park</div>
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

