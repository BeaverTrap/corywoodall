'use client';

import Image from 'next/image';

export default function GalleryPreview({ series, images }) {
  const cover = series.cover_image_url || images[0]?.image_url;
  const description = series.description || '';
  const [intro, ...works] = description.split('\n\n');

  return (
    <div className="bg-stone-100 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-black/50 mb-4">Homepage gallery section</p>

      <div className="flex flex-col gap-4">
        <div className="w-full max-w-xs mx-auto">
          <div className="relative aspect-square bg-white rounded overflow-hidden border border-black/10">
            {cover ? (
              <Image src={cover} alt={series.title || 'Cover'} fill className="object-contain" unoptimized />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-black/40">
                No cover image
              </div>
            )}
          </div>
        </div>

        <div className="backdrop-blur-md bg-white/80 p-4 rounded-lg border border-white/20 shadow">
          <h3 className="text-2xl font-bold mb-3">{series.title || 'Gallery title'}</h3>
          <p className="text-sm leading-relaxed whitespace-pre-line mb-3">{intro || 'Description'}</p>

          {works.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs text-black/60 mb-1">Works in this series:</p>
              {works.join('\n').split('\n').filter(Boolean).map((work) => (
                <p key={work} className="text-sm text-blue-700">
                  {work}
                </p>
              ))}
            </div>
          )}

          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <div key={image.id || `${image.image_url}-${index}`} className="relative aspect-square bg-white rounded overflow-hidden">
                  {image.image_url ? (
                    <Image
                      src={image.thumbnail_url || image.image_url}
                      alt={image.alt_text || ''}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
