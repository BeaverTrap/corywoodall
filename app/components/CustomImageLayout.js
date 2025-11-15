'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaTimes } from 'react-icons/fa';

export default function CustomImageLayout({ topImages, bottomLeft, bottomRight }) {
  const [expandedImage, setExpandedImage] = useState(null);

  const handleImageClick = (src) => {
    setExpandedImage(src);
  };

  const allImages = [...(topImages || []), bottomLeft, bottomRight].filter(Boolean);

  return (
    <>
      <div className="my-8 space-y-4">
        {/* Top Row - 3 images */}
        {topImages && topImages.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {topImages.map((img, index) => (
              <div
                key={index}
                className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg cursor-pointer"
                onClick={() => handleImageClick(img.src)}
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
        )}

        {/* Bottom Row - Landscape left, regular right */}
        <div className="grid grid-cols-2 gap-4">
          {/* Bottom Left - Landscape */}
          {bottomLeft && (
            <div
              className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg cursor-pointer"
              onClick={() => handleImageClick(bottomLeft.src)}
            >
              <Image
                src={bottomLeft.src}
                alt={bottomLeft.alt}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Bottom Right */}
          {bottomRight && (
            <div
              className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg cursor-pointer"
              onClick={() => handleImageClick(bottomRight.src)}
            >
              <Image
                src={bottomRight.src}
                alt={bottomRight.alt}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      </div>

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
              alt={allImages.find(img => img.src === expandedImage)?.alt || 'Expanded image'}
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

