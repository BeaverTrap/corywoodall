'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaTimes } from 'react-icons/fa';

export default function ImageWithCaption({ src, alt, caption, isLandscape = false, isSlim = false }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const heightClass = isSlim
    ? 'h-48'
    : isLandscape
      ? 'h-56 sm:h-72 md:h-96 lg:h-[500px]'
      : 'h-48 sm:h-64';

  return (
    <>
      <figure className="my-8">
        <div 
          className={`relative w-full ${heightClass} rounded-lg overflow-hidden shadow-lg cursor-pointer`}
          onClick={() => setIsExpanded(true)}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className={isSlim ? "object-contain bg-gray-100" : "object-cover"}
          />
        </div>
        {caption && (
          <figcaption className="mt-2 text-sm text-black/60 text-center italic">
            {caption}
          </figcaption>
        )}
      </figure>

      {isExpanded && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setIsExpanded(false)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(false);
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
              src={src}
              alt={alt}
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

