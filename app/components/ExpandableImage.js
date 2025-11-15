'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaTimes } from 'react-icons/fa';

export default function ExpandableImage({ src, alt, className = '', fill = false, width, height }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div 
        className={`relative cursor-pointer ${fill ? 'w-full h-full' : ''} ${className}`}
        onClick={() => setIsExpanded(true)}
      >
        {fill ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width || 1920}
            height={height || 1080}
            className="object-cover"
          />
        )}
      </div>

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

