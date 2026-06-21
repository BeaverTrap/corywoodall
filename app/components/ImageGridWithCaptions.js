'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaTimes } from 'react-icons/fa';

export default function ImageGridWithCaptions({ images, cols = 3, caption }) {
  const [expandedImage, setExpandedImage] = useState(null);

  const gridClass = cols === 2 ? 'grid-cols-2' : cols === 4 ? 'grid-cols-4' : 'grid-cols-3';

  return (
    <>
      <figure className="my-8">
        <div className={`grid ${gridClass} gap-4`}>
          {images.map((img, index) => (
            <div
              key={index}
              className="relative w-full h-40 sm:h-56 md:h-64 rounded-lg overflow-hidden shadow-lg cursor-pointer"
              onClick={() => setExpandedImage(img.src)}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
        {caption && (
          <figcaption className="mt-2 text-sm text-black/60 text-center italic">
            {caption}
          </figcaption>
        )}
      </figure>

      {expandedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setExpandedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              setExpandedImage(null);
            }}
            aria-label="Close image"
          >
            <FaTimes className="w-8 h-8" />
          </button>
          <div
            className="relative max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={expandedImage}
              alt={images.find(img => img.src === expandedImage)?.alt || 'Expanded image'}
              width={1920}
              height={1080}
              className="object-contain max-w-full max-h-[90vh]"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}

