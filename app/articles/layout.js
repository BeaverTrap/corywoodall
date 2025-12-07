'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Navigation from '../components/Navigation';

export default function ArticlesLayout({ children }) {
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Calculate parallax transform
      const parallaxTransform = -(scrollPosition / (documentHeight - windowHeight) * 50);
      const parallaxBg = document.querySelector('.articles-parallax-bg');
      if (parallaxBg) {
        parallaxBg.style.transform = `translateY(${parallaxTransform}%)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background image with overlay */}
      <div className="fixed inset-0 z-0 w-full h-full">
        <div className="articles-parallax-bg absolute inset-0 w-full h-[200vh]">
          <div className="relative w-full h-full">
            <Image
              src="/images/Orange Fantail crop_upscale.jpg"
              alt="Background"
              fill
              priority
              className="object-cover"
              quality={100}
            />
          </div>
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-white/80" />
        </div>
      </div>
      <div className="relative z-10">
        {/* Navigation */}
        <Navigation currentPage="articles" />
        <div className="pt-20 pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 