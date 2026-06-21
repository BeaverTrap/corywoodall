'use client';

import Image from 'next/image';

export function GalleryDetailsPreview({ series }) {
  const cover = series.cover_image_url;
  const description = series.description || '';
  const [intro, ...works] = description.split('\n\n');

  return (
    <div className="bg-stone-100 p-4 h-full">
      <div className="flex flex-col gap-4 h-full">
        <div className="w-full max-w-[200px] mx-auto">
          <div className="relative aspect-square bg-white rounded overflow-hidden border border-black/10">
            {cover ? (
              <Image src={cover} alt={series.title || 'Cover'} fill className="object-contain" unoptimized />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-black/40">
                No cover
              </div>
            )}
          </div>
        </div>
        <div className="backdrop-blur-md bg-white/80 p-4 rounded-lg border border-white/20 shadow flex-1">
          <h3 className="text-xl font-bold mb-2">{series.title || 'Gallery title'}</h3>
          <p className="text-sm leading-relaxed whitespace-pre-line">{intro || 'Description'}</p>
          {works.length > 0 ? (
            <div className="mt-3 space-y-1">
              {works.join('\n').split('\n').filter(Boolean).map((work) => (
                <p key={work} className="text-sm text-blue-700">
                  {work}
                </p>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function GalleryImagesPreview({ images }) {
  return (
    <div className="bg-stone-100 p-4 h-full">
      {images.length === 0 ? (
        <p className="text-sm text-black/50 p-4">Images will appear here as you upload.</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {images.map((image, index) => (
            <div
              key={image.id || `${image.image_url}-${index}`}
              className="relative aspect-square bg-white rounded overflow-hidden border border-black/10"
            >
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
  );
}
