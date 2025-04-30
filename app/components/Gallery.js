'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

export default function Gallery({ images, onClose }) {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Convert images array to the format expected by yet-another-react-lightbox
  const slides = images.map(image => ({
    src: image.full,
    alt: image.alt
  }));

  return (
    <div className="relative">
      {/* Thumbnail Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => {
              setPhotoIndex(index);
              setIsOpen(true);
            }}
            className="group relative w-full max-w-md aspect-square cursor-pointer"
          >
            <Image
              src={image.thumbnail}
              alt={image.alt}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={index < 6}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-white text-lg font-medium">View Image</span>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <Lightbox
        open={isOpen}
        close={() => {
          setIsOpen(false);
          if (onClose) onClose();
        }}
        index={photoIndex}
        slides={slides}
      />
    </div>
  );
} 