import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { FaTwitter, FaFacebook, FaEnvelope } from 'react-icons/fa';
import Image from 'next/image';
import ImageWithCaption from '../../components/ImageWithCaption';
import ImageGridWithCaptions from '../../components/ImageGridWithCaptions';

export const metadata = {
  title: 'Artist in Residence: Patagonia Lake State Park',
  description: 'Cory Woodall\'s residency at Patagonia Lake State Park, exploring cyanotype photography in the unique desert-meets-water environment.',
  openGraph: {
    title: 'Artist in Residence: Patagonia Lake State Park',
    description: 'Cory Woodall\'s residency at Patagonia Lake State Park, exploring cyanotype photography in the unique desert-meets-water environment.',
    url: 'https://corywoodall.com/articles/patagonia-lake-residency',
    type: 'article',
    images: [
      {
        url: 'https://corywoodall.com/images/patagonia-lake-residency/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Cory Woodall at Patagonia Lake State Park',
      },
    ],
  },
};

export default function PatagoniaLakeResidency() {
  const data = {
    title: 'Artist in Residence: Patagonia Lake State Park',
    date: '2025-11-14',
    slug: 'patagonia-lake-residency'
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
            <span>5 min read</span>
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
          <ImageWithCaption
            src="/images/patagonia-lake-residency/park-landscape-1.jpg"
            alt="Patagonia Lake State Park landscape showing the desert-meets-water environment"
            caption="Patagonia Lake State Park"
            isLandscape={true}
          />

          <p className="text-lg text-black/80 leading-relaxed tracking-wide mb-6">
            Cory Woodall is currently spending three weeks at Patagonia Lake State Park as part of the Artist-in-Residence program supported by Arizona State Parks & Trails and the Arizona Commission on the Arts (October 29–November 16, 2025). The residency gives her uninterrupted time to continue her ongoing cyanotype research, this time working directly with plant material found in one of Arizona's most biologically mixed environments. The lake's blend of desert and riparian habitat provides a broad range of structures and forms that align well with her continued focus on botanical imaging, contact printing, and the material qualities of early photographic processes.
          </p>

          <ImageWithCaption
            src="/images/patagonia-lake-residency/fieldwork-4.jpg"
            alt="Fieldwork documenting the cyanotype process"
            isLandscape={true}
          />

          <p className="text-lg text-black/80 leading-relaxed tracking-wide mb-4">
            Cyanotype remains central to her practice because of its clarity, accessibility, and long historical relationship with botanical documentation. Introduced in 1842, the process relies on iron-based chemistry and ultraviolet light, producing its characteristic blue results through direct contact between plant material and hand-coated paper. The simplicity of the method allows the subject matter—structure, density, and the internal geometry of each specimen—to determine much of the final image. Working at Patagonia Lake adds a new group of species shaped by the meeting point of two ecosystems, offering forms that differ from those found in her previous locations.
          </p>

          <ImageGridWithCaptions
            images={[
              { src: '/images/patagonia-lake-residency/cyanotype-process-1.jpg', alt: 'Cyanotype prints in progress' },
              { src: '/images/patagonia-lake-residency/cyanotype-process-2.jpg', alt: 'Cyanotype development process' },
              { src: '/images/patagonia-lake-residency/cyanotype-process-3.jpg', alt: 'Cyanotype process detail' }
            ]}
            cols={3}
            caption="Cyanotype process at Patagonia Lake"
          />

          <ImageWithCaption
            src="/images/patagonia-lake-residency/cyanotype-subject.jpg"
            alt="Cyanotype subject material growing in its natural environment"
            caption="Subject material growing in its natural environment"
            isLandscape={true}
          />

          <p className="text-lg text-black/80 leading-relaxed tracking-wide mb-4">
            Throughout the residency, the workspace has filled quickly with active work. Cyanotypes are taped across the cabin walls, grouped on the floor for comparison, and drying outside on the porch where airflow helps stabilize the chemistry. Dozens of pieces move through various stages at the same time: freshly coated sheets set aside for later, compositions arranged and waiting for exposure, prints developing their tones after rinsing, and completed tests gathered for review. The strong UV exposure at Patagonia Lake allows for consistent and efficient printing, making it possible to explore multiple variations in a single day and evaluate how different species behave under the same conditions.
          </p>

          <ImageGridWithCaptions
            images={[
              { src: '/images/patagonia-lake-residency/fieldwork-1.jpg', alt: 'Fieldwork at Patagonia Lake' },
              { src: '/images/patagonia-lake-residency/fieldwork-2.jpg', alt: 'Fieldwork documenting cyanotype creation' }
            ]}
            cols={2}
          />

          <ImageWithCaption
            src="/images/patagonia-lake-residency/fieldwork-3.jpg"
            alt="Cyanotype process in progress at Patagonia Lake"
            caption="Fieldwork at Patagonia Lake"
            isLandscape={true}
          />

          <ImageGridWithCaptions
            images={[
              { src: '/images/patagonia-lake-residency/fieldwork-5.jpg', alt: 'Fieldwork at Patagonia Lake' },
              { src: '/images/patagonia-lake-residency/fieldwork-6.jpg', alt: 'Cyanotype fieldwork in progress' }
            ]}
            cols={2}
          />

          <ImageWithCaption
            src="/images/patagonia-lake-residency/fieldwork-7.jpg"
            alt="Fieldwork documenting the cyanotype process at Patagonia Lake"
            isLandscape={true}
          />

          <p className="text-lg text-black/80 leading-relaxed tracking-wide mb-4">
            All plant material used during the residency is collected responsibly—primarily from naturally fallen pieces or minimal-impact gathering—ensuring the surrounding environment remains undisturbed. The diversity of species around the lake provides a wide range of textures and densities, from fine, detailed structures to heavier forms that create bold silhouettes. Each contributes different visual possibilities within the cyanotype process.
          </p>

          <ImageGridWithCaptions
            images={[
              { src: '/images/patagonia-lake-residency/plant-specimens-1.jpg', alt: 'Plant specimens collected at Patagonia Lake' },
              { src: '/images/patagonia-lake-residency/plant-specimens-2.jpg', alt: 'Plant specimens from Patagonia Lake' },
              { src: '/images/patagonia-lake-residency/plant-specimens-3.jpg', alt: 'Plant specimens from Patagonia Lake' }
            ]}
            cols={3}
          />

          <ImageWithCaption
            src="/images/patagonia-lake-residency/plant-specimens-5.jpg"
            alt="Botanical specimens from Patagonia Lake"
            isLandscape={true}
          />

          <ImageGridWithCaptions
            images={[
              { src: '/images/patagonia-lake-residency/plant-specimens-4.jpg', alt: 'Plant specimens collected at Patagonia Lake' },
              { src: '/images/patagonia-lake-residency/plant-specimens-6.jpg', alt: 'Plant specimens arranged for cyanotype work' },
              { src: '/images/patagonia-lake-residency/plant-specimens-7.jpg', alt: 'Plant specimens from Patagonia Lake State Park' }
            ]}
            cols={3}
          />

          <ImageWithCaption
            src="/images/patagonia-lake-residency/lake-environment-1.jpg"
            alt="Patagonia Lake environment showing the unique desert-meets-water landscape"
            caption="Patagonia Lake environment"
            isLandscape={true}
          />

          <p className="text-lg text-black/80 leading-relaxed tracking-wide mb-4">
            The work produced during this residency expands her ongoing investigation into how environment influences both the technical and visual outcomes of cyanotype. The prints accumulating in the cabin are not final exhibition pieces; they function as a direct record of the location, the material available, and the testing done throughout the three-week period.
          </p>

          <ImageGridWithCaptions
            images={[
              { src: '/images/patagonia-lake-residency/finished-works-1.jpg', alt: 'Cyanotype works taped up around the cabin' },
              { src: '/images/patagonia-lake-residency/finished-works-2.jpg', alt: 'In-progress cyanotype prints displayed' },
              { src: '/images/patagonia-lake-residency/finished-works-3.jpg', alt: 'Cyanotype works in progress' },
              { src: '/images/patagonia-lake-residency/finished-works-4.jpg', alt: 'Works in progress taped up in the cabin' },
              { src: '/images/patagonia-lake-residency/finished-works-5.jpg', alt: 'Cyanotype prints in progress' },
              { src: '/images/patagonia-lake-residency/finished-works-6.jpg', alt: 'In-progress cyanotype works' }
            ]}
            cols={3}
            caption="Works in progress at the cabin"
          />

          <p className="text-lg text-black/80 leading-relaxed tracking-wide mb-4">
            A full update and a selection of finished works from Patagonia Lake will be added to the site after the residency concludes on November 16.
          </p>

          <ImageWithCaption
            src="/images/patagonia-lake-residency/feild-butterflys-1.jpg"
            alt="Butterflies in the field at Patagonia Lake"
            caption="Butterflies along the birders trail"
            isLandscape={true}
          />

          <p className="text-lg text-black/80 leading-relaxed tracking-wide mb-6">
            To learn more about Cory Woodall's work and follow updates from the residency, visit the <a href="/articles" className="text-blue-600 hover:text-blue-800 underline">articles section</a> and <a href="/portfolio" className="text-blue-600 hover:text-blue-800 underline">portfolio gallery</a>.
          </p>
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
            <a 
              href="/articles/patagonia-lake-works" 
              className="group flex items-center justify-end text-gray-600 hover:text-black transition-colors"
            >
              <div className="text-gray-400 group-hover:text-gray-600">→</div>
              <div className="ml-4">
                <div className="text-sm text-gray-500 group-hover:text-gray-700">Next Article</div>
                <div className="font-medium group-hover:underline">Reflections on the Patagonia Lake Works</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

